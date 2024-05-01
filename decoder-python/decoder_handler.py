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

def vessel_data_to_dict(vessel_data):
    return {
        "mmsi": vessel_data.mmsi,
        "name": vessel_data.name,
        "lat": vessel_data.lat,
        "lon": vessel_data.lon,
        "lastUpdateTime": vessel_data.lastUpdateTime,
        "destination": vessel_data.destination,
        "callsign": vessel_data.callsign,
        "speed": vessel_data.speed,
        "ship_type": vessel_data.ship_type,
        "positions": [position_to_dict(pos) for pos in vessel_data.positions.values()]
    }

def insert_or_update_vessel_data(vessel_data):
    conn = sqlite3.connect('decoded_data.db')
    cursor = conn.cursor()
    data_json = json.dumps(vessel_data_to_dict(vessel_data))
    cursor.execute('SELECT id FROM decoded_data WHERE mmsi = ?', (vessel_data.mmsi,))
    record = cursor.fetchone()
    if record:
        cursor.execute('UPDATE decoded_data SET data = ? WHERE mmsi = ?', (data_json, vessel_data.mmsi))
    else:
        cursor.execute('INSERT INTO decoded_data (mmsi, data) VALUES (?, ?)', (vessel_data.mmsi, data_json))
    conn.commit()
    conn.close()

def cleanup_old_data():
    conn = sqlite3.connect('decoded_data.db')
    cursor = conn.cursor()
    twelve_hours_ago = datetime.now() - timedelta(hours=12)
    
    cursor.execute('SELECT id, data FROM decoded_data')
    records = cursor.fetchall()

    for record in records:
        vessel_data = json.loads(record[1])
        date_format = "%Y%m%d%H%M%S"
        
        new_positions = [pos for pos in vessel_data.get('positions', []) if datetime.strptime(pos['timestamp'], date_format) >= twelve_hours_ago]

        if not new_positions or (vessel_data.get('lastUpdateTime') and datetime.strptime(vessel_data['lastUpdateTime'], date_format) < twelve_hours_ago):
            cursor.execute('DELETE FROM decoded_data WHERE id = ?', (record[0],))
        else:
            if new_positions != vessel_data['positions']:
                vessel_data['positions'] = new_positions
                cursor.execute('UPDATE decoded_data SET data = ? WHERE id = ?', (json.dumps(vessel_data), record[0]))

    conn.commit()
    conn.close()


class TagsProcessingService:
    def __init__(self):
        self.vessels = {}
        self.timing_data = {
            'update_vessel_data_with_sentence': [],
            'position_check': [],
            'append_and_sort': [],
            'update_positions': [],
            'process_sentences': []
        }

    def process_sentences(self, sentences):
        start_time = time.time()
        for sentence in sentences:
            start_update = time.time()
            vessel_data = self.vessels.get(sentence['mmsi'])
            if not vessel_data:
                vessel_data = VesselData(mmsi=sentence['mmsi'])
                self.vessels[sentence['mmsi']] = vessel_data

            self.update_vessel_data_with_sentence(vessel_data, sentence)
            self.timing_data['update_vessel_data_with_sentence'].append(time.time() - start_update)

        start_update_positions = time.time()
        for vessel_data in self.vessels.values():
            if vessel_data.positions:
                latest_position = vessel_data.positions.peekitem(-1)[1]
                vessel_data.lat = latest_position.lat
                vessel_data.lon = latest_position.lon
                vessel_data.lastUpdateTime = latest_position.timestamp
            insert_or_update_vessel_data(vessel_data)
        self.timing_data['update_positions'].append(time.time() - start_update_positions)

        total_time = time.time() - start_time
        self.timing_data['process_sentences'].append(total_time)
        logger.info(f"Total processing time for sentences: {total_time:.2f} seconds.")

        self.log_timing_data()

        return list(self.vessels.values())

    def update_vessel_data_with_sentence(self, vessel_data, sentence):
        if 'lat' in sentence and 'lon' in sentence:
            new_position = Position(timestamp=sentence['receiver_timestamp'], lat=sentence['lat'], lon=sentence['lon'])
            position_key = (new_position.timestamp, new_position.lat, new_position.lon)

            vessel_data.positions[position_key] = new_position

        if 'shipname' in sentence:
            vessel_data.name = sentence['shipname']
        if 'destination' in sentence:
            vessel_data.destination = sentence['destination']
        if 'callsign' in sentence:
            vessel_data.callsign = sentence['callsign']
        if 'speed' in sentence:
            vessel_data.speed = sentence['speed']
        if 'ship_type' in sentence:
            vessel_data.ship_type = sentence['ship_type']


    def log_timing_data(self):
        for key, times in self.timing_data.items():
            if times:
                average_time = sum(times) / len(times)
                logger.info(f"Average time for {key}: {average_time:.2f} seconds")

def process_data(file_path):
    if not pathlib.Path(file_path).exists():
        print(f"File not found: {file_path}")
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
            print(f"ValueError decoding message: {msg}. Error: {ve}")
        except Exception as e:
            print(f"Unexpected error decoding message: {msg}. Error: {e}")

    decoded_data_with_timestamps = []
    with FileReaderStream(str(file_path)) as file_reader:
        decoded_data_with_timestamps = [decode_message(msg) for msg in file_reader if msg is not None]

    return decoded_data_with_timestamps

def is_valid_mmsi(mmsi):
    return isinstance(mmsi, int) and 100000000 <= mmsi <= 999999999

def is_msg_type_in_range(msg_type):
    return 1 <= msg_type <= 5

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
        print(f"Failed to write JSON: {e}")

def process_and_save_data():
    base_path = pathlib.Path(__file__).parent
    output_path = base_path / 'output' / 'combined_decoded_2448.json'
    combined_whole = base_path / 'input' / 'combined_last_12_hours.txt'
    try:
        start = time.time()
        processed_data = process_data(combined_whole)
        log_time_taken(start, "Processing data")

        start = time.time()
        filtered_data = filter_data(processed_data)
        log_time_taken(start, "Filtering data")

        start = time.time()
        service = TagsProcessingService()
        vessel_data = service.process_sentences(filtered_data)
        log_time_taken(start, "Processing sentences")

        start = time.time()
        vessel_data_json = [vessel_data_to_dict(v) for v in vessel_data]
        log_time_taken(start, "Converting data to JSON")

        start = time.time()
        write_to_json(vessel_data_json, output_path)
        log_time_taken(start, "Writing JSON to file")

    except Exception as e:
        print(f"An error occurred: {e}")

def run_fetch_script():
    script_path = './fetch12FromRaspberry.sh'
    try:
        result = subprocess.run(script_path, shell=True, capture_output=True, text=True)
        print("STDOUT:", result.stdout)
        print("STDERR:", result.stderr)
    except subprocess.CalledProcessError as e:
        print(f"An error occurred: {e}")
        print(f"STDOUT: {e.stdout}")
        print(f"STDERR: {e.stderr}")
    

def main_loop():
    while True:
        logging.info("Starting data processing loop.")
        run_fetch_script()
        process_and_save_data()
        start = time.time()
        cleanup_old_data()
        log_time_taken(start, "Cleanup old data")
        logging.info("Data processing completed. Waiting 90 seconds.")
        time.sleep(90)

if __name__ == "__main__":
    main_loop()
