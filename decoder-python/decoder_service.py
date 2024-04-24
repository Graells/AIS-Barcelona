from flask import Flask, jsonify
import pathlib
import json
import base64
from pyais.stream import FileReaderStream
import os
from datetime import datetime, timedelta
from dataclasses import dataclass, field
from typing import List, Optional
from flask_cors import CORS
import subprocess
import time
import logging
from typing import Dict, Tuple, Optional
from operator import attrgetter

def log_time_taken(start, stage):
    print(f"{stage} took {time.time() - start:.2f} seconds.")

app = Flask(__name__)


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
    positions: Dict[Tuple[str, float, float], Position] = field(default_factory=dict) 


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



logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

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
                    latest_position = max(vessel_data.positions.values(), key=attrgetter('timestamp'))
                    vessel_data.lat = latest_position.lat
                    vessel_data.lon = latest_position.lon
                    vessel_data.lastUpdateTime = latest_position.timestamp
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
            
            if position_key not in vessel_data.positions:
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





def get_last_12_hour_files(base_path):
    files = []
    current_time = datetime.now()
    for i in range(12):
        hour_delta = current_time - timedelta(hours=i)
        file_name = hour_delta.strftime('%Y%m%d%H') + '_AIS.txt'
        file_path = base_path / 'input' / file_name
        if file_path.exists():
            files.append(file_path)
    return files


def process_data(file_path):
    decoded_data_with_timestamps = []
    if not pathlib.Path(file_path).exists():
        print(f"File not found: {file_path}")
        return decoded_data_with_timestamps

    with FileReaderStream(str(file_path)) as file_reader:
        for msg in file_reader:
            try:
                msg.tag_block.init()
                tags = msg.tag_block.asdict()
                receiver_timestamp = tags.get("receiver_timestamp")
                decoded = msg.decode()
                decoded_dict = decoded.asdict()
                decoded_dict['receiver_timestamp'] = receiver_timestamp
                for key, value in decoded_dict.items():
                    if isinstance(value, bytes):
                        decoded_dict[key] = base64.b64encode(value).decode('utf-8')
                decoded_data_with_timestamps.append(decoded_dict)
            except Exception as e:
                print(f"Error decoding message: {msg}. Error: {e}")
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

def read_and_combine_files(file_paths):
    combined_file_path = pathlib.Path(__file__).parent / 'input' / 'combined.txt'
    
    with open(combined_file_path, 'w') as combined_file:
        for file_path in file_paths:
            if file_path.exists():
                with open(file_path, 'r') as file:
                    combined_file.write(file.read())

    return combined_file_path

def write_to_json(data, output_path):
    try:
        json_output = json.dumps(data)
        with open(output_path, 'w') as json_file:
            json_file.write(json_output)
    except Exception as e:
        print(f"Failed to write JSON: {e}")

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

CORS(app)

@app.route('/get-decoded-2448', methods=['GET'])
def get_decoded_2448():
    start = time.time()
    base_path = pathlib.Path(__file__).parent
    output_path = base_path / 'output' / 'combined_decoded_2448.json'

    try:
        print("Starting the fetch script...")
        run_fetch_script()
        log_time_taken(start, "Fetching script")

        start = time.time()
        file_paths = get_last_12_hour_files(base_path)
        log_time_taken(start, "Getting file paths")

        start = time.time()
        combined_file_path = read_and_combine_files(file_paths)
        log_time_taken(start, "Combining files")

        start = time.time()
        processed_data = process_data(combined_file_path)
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

        start = time.time()
        with open(output_path, 'r') as json_file:
            decoded_data = json.load(json_file)
        log_time_taken(start, "Reading JSON from file")

        return jsonify(decoded_data)

    except subprocess.CalledProcessError as e:
        print(f"An error occurred in the fetch script: {e}")
        return jsonify({"error": f"Fetch script failed: {e}"}), 500
    except FileNotFoundError:
        print("Requested file not found.")
        return jsonify({"error": "Requested file not found"}), 404
    except Exception as e:
        print(f"An error occurred: {e}")
        return jsonify({"error": str(e)}), 500


if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, threaded=True)