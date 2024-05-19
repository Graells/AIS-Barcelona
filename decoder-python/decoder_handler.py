from collections import OrderedDict
from datetime import datetime, timedelta
import time
import json
import base64
import pathlib
import subprocess
import logging
from pyais.stream import FileReaderStream
from dataclasses import dataclass, field
from sortedcontainers import SortedDict
from typing import Optional, Dict, Tuple
import sqlite3

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)
def log_time_taken(start, stage):
    print(f"{stage} took {time.time() - start:.2f} seconds.")


@dataclass
class Position:
    timestamp: str
    lat: float
    lon: float

@dataclass
class VesselData:
    mmsi: int
    name: str = ''
    lat: Optional[float] = None
    lon: Optional[float] = None
    lastUpdateTime: Optional[str] = None
    destination: Optional[str] = None
    callsign: Optional[str] = None
    speed: Optional[float] = None
    ship_type: Optional[int] = None
    positions: SortedDict = field(default_factory=SortedDict)

def position_to_dict(position):
    return {
        "timestamp": position.timestamp,
        "lat": position.lat,
        "lon": position.lon
    }

def get_db_connection():
    return sqlite3.connect('decoded_data.db')

def insert_or_update_vessel_data(vessel_data):
    with get_db_connection() as conn:
        try:
            cursor = conn.cursor()
            cursor.execute('''
                INSERT INTO vessels (mmsi, name, lat, lon, lastUpdateTime, destination, callsign, speed, ship_type)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
                ON CONFLICT(mmsi) DO UPDATE SET
                    name = COALESCE(NULLIF(excluded.name, ''), vessels.name),
                    lat = excluded.lat,
                    lon = excluded.lon,
                    lastUpdateTime = excluded.lastUpdateTime,
                    destination = excluded.destination,
                    callsign = COALESCE(NULLIF(excluded.callsign, ''), vessels.callsign),
                    speed = excluded.speed,
                    ship_type = COALESCE(NULLIF(excluded.ship_type, ''), vessels.ship_type)
            ''', (
                vessel_data.mmsi, 
                vessel_data.name, 
                vessel_data.lat, vessel_data.lon, 
                vessel_data.lastUpdateTime, 
                vessel_data.destination, 
                vessel_data.callsign, 
                vessel_data.speed, 
                vessel_data.ship_type
            ))
            if vessel_data.positions:
                for position in vessel_data.positions.values():
                    if is_valid_lat_lon(position.lat, position.lon):
                        cursor.execute('''
                            INSERT INTO positions (mmsi, timestamp, lat, lon)
                            VALUES (?, ?, ?, ?)
                            ON CONFLICT DO NOTHING
                        ''', (vessel_data.mmsi, position.timestamp, position.lat, position.lon))
            conn.commit()
        except Exception as e:
            logger.error(f"Error inserting or updating vessel data: {e}")
            conn.rollback()
            raise e


def cleanup_old_data():
    with get_db_connection() as conn:
        try:
            cursor = conn.cursor()
            deadline = (datetime.now() - timedelta(hours=96)).strftime('%Y%m%d%H%M%S')

            cursor.execute('''
                DELETE FROM vessels
                WHERE lastUpdateTime < ?
            ''', (deadline,))

            cursor.execute('''
                DELETE FROM positions
                WHERE timestamp < ?
            ''', (deadline,))

            conn.commit()
        except Exception as e:
            logger.error(f"Error cleaning up old data: {e}")
            conn.rollback()
            raise e


class TagsProcessingService:
    def __init__(self):
        self.vessels = {}

    def process_sentences(self, sentences):
        for sentence in sentences:
            vessel_data = self.vessels.get(sentence['mmsi'])
            if not vessel_data:
                vessel_data = VesselData(mmsi=sentence['mmsi'])
                self.vessels[sentence['mmsi']] = vessel_data

            self.update_vessel_data_with_sentence(vessel_data, sentence)

        for vessel_data in self.vessels.values():
            if vessel_data.positions:
                latest_position = vessel_data.positions.peekitem(-1)[1]
                if is_valid_lat_lon(latest_position.lat, latest_position.lon):
                    vessel_data.lat = latest_position.lat
                    vessel_data.lon = latest_position.lon
                    vessel_data.lastUpdateTime = latest_position.timestamp
            insert_or_update_vessel_data(vessel_data)
        return list(self.vessels.values())

    def update_vessel_data_with_sentence(self, vessel_data, sentence):
        if 'lat' in sentence and 'lon' in sentence:
            if is_valid_lat_lon(sentence['lat'], sentence['lon']):
                new_position = Position(timestamp=sentence['receiver_timestamp'], lat=sentence['lat'], lon=sentence['lon'])
                position_key = (new_position.timestamp, new_position.lat, new_position.lon)
                vessel_data.positions[position_key] = new_position
        if 'shipname' in sentence:
            if sentence.get('shipname', '') not in ('', ' ', 'unknown', None):
                vessel_data.name = sentence['shipname']
        if 'destination' in sentence:
            vessel_data.destination = sentence['destination']
        if 'callsign' in sentence:
            if sentence.get('callsign', '') not in ('', ' ', 'unknown', None):
                vessel_data.callsign = sentence['callsign']
        if 'speed' in sentence:
            vessel_data.speed = sentence['speed']
        if 'ship_type' in sentence:
            if sentence.get('ship_type', None) not in ('', ' ', 'unknown', None):
                vessel_data.ship_type = sentence['ship_type']

def is_valid_lat_lon(lat, lon):
    return -90 <= lat <= 90 and -180 <= lon <= 180

def process_data(file_path):
    if not pathlib.Path(file_path).exists():
        logger.error(f"File not found: {file_path}")
        return []

    def decode_message(msg):
        try:
            msg.tag_block.init()
            tags = msg.tag_block.asdict()
            decoded = msg.decode()
            decoded_dict = decoded.asdict()
            decoded_dict['receiver_timestamp'] = tags.get("receiver_timestamp")

            for key, value in decoded_dict.items():
                if isinstance(value, bytes):
                    decoded_dict[key] = base64.b64encode(value).decode('utf-8')

            return decoded_dict
        except ValueError as ve:
            logger.error(f"ValueError decoding message: {msg}. Error: {ve}")
        except Exception as e:
            logger.error(f"Unexpected error decoding message: {msg}. Error: {e}")

    decoded_data_with_timestamps = []
    with FileReaderStream(str(file_path)) as file_reader:
        decoded_data_with_timestamps = [decode_message(msg) for msg in file_reader if msg is not None]

    return decoded_data_with_timestamps

def is_valid_mmsi(mmsi):
    return isinstance(mmsi, int) and 0 <= mmsi <= 999999999

def is_msg_type_in_range(msg_type):
    return 1 <= msg_type <= 27

def filter_data(decoded_data):
    return [
        entry for entry in decoded_data
        if is_msg_type_in_range(entry.get('msg_type')) and is_valid_mmsi(entry.get('mmsi'))
    ]

def write_to_json(data, output_path):
    try:
        json_output = json.dumps(data)
        with open(output_path, 'w') as json_file:
            json_file.write(json_output)
    except Exception as e:
        logger.error(f"Failed to write JSON: {e}")

def vessel_data_to_dict(vessel_data):
    return {
        key: value for key, value in {
            "mmsi": vessel_data.mmsi,
            "name": vessel_data.name,
            "lat": vessel_data.lat,
            "lon": vessel_data.lon,
            "lastUpdateTime": vessel_data.lastUpdateTime,
            "destination": vessel_data.destination,
            "callsign": vessel_data.callsign,
            "speed": vessel_data.speed,
            "ship_type": vessel_data.ship_type,
            # "positions": [position_to_dict(pos) for pos in vessel_data.positions.values()]
        }.items() if value is not None
    }

def custom_serializer(obj):
    if isinstance(obj, dict):
        return {key: custom_serializer(value) for key, value in obj.items()}
    elif isinstance(obj, list):
        return [custom_serializer(item) for item in obj]
    elif hasattr(obj, "__dict__"):
        return custom_serializer(obj.__dict__) 
    elif isinstance(obj, (str, int, float, bool, type(None))):
        return obj
    return str(obj) 

def process_and_save_data():
    base_path = pathlib.Path(__file__).parent
    combined_whole = base_path / 'input' / 'combined_last_12_hours.txt'
    output_path = base_path / 'output' / 'processed_results.json'
    try:
        processed_data = process_data(combined_whole)
        filtered_data = filter_data(processed_data)
        service = TagsProcessingService()
        vessel_data = service.process_sentences(filtered_data)

        # with open(output_path, 'w', encoding='utf-8') as file:
        #     json.dump(custom_serializer(processed_data), file, ensure_ascii=False, indent=4)

        # vessel_data_json = [vessel_data_to_dict(v) for v in processed_data]
        # write_to_json(vessel_data, output_path)

    except Exception as e:
        logger.error(f"An error occurred: {e}")

def run_fetch_script():
    script_path = './fetch12FromRaspberry.sh'
    try:
        result = subprocess.run(script_path, shell=True, capture_output=True, text=True)
        logger.info("STDOUT: %s", result.stdout)
        logger.error("STDERR: %s", result.stderr)
    except subprocess.CalledProcessError as e:
        logger.error(f"An error occurred: {e}")
        logger.error(f"STDOUT: {e.stdout}")
        logger.error(f"STDERR: {e.stderr}")

def main_loop():
    last_cleanup_time = time.time()
    cleanup_interval = 3600 # 1 hour
    while True:
        logging.info("Starting data processing loop.")
        begin = time.time()
        start = time.time()
        run_fetch_script()
        log_time_taken(start, "Run fetch script")
        start = time.time()
        process_and_save_data()
        log_time_taken(start, "Process and save data")
        start = time.time()
        if time.time() - last_cleanup_time >= cleanup_interval:
            cleanup_old_data()
            last_cleanup_time = time.time()
        log_time_taken(start, "Cleanup old data")
        log_time_taken(begin, "Total loop time")
        logging.info("Data processing completed. Waiting 30 seconds.")
        time.sleep(30)

if __name__ == "__main__":
    main_loop()


# def parse_date(timestamp):
#     try:
#         return datetime.strptime(timestamp, '%Y%m%d%H%M%S')
#     except ValueError:
#         try:
#             return datetime.strptime(timestamp.split(':')[1], '%Y%m%d%H%M%S')
#         except ValueError:
#             return None