import pathlib
import json
import base64

from pyais.stream import FileReaderStream

def process_file(filename):
    decoded_data_with_timestamps = []
    for msg in FileReaderStream(str(filename)):
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
    if isinstance(mmsi, int) and (100000000 <= mmsi <= 999999999):
        return True
    return False

def is_msg_type_in_range(msg_type):
    return 1 <= msg_type <= 5

def filter_data(decoded_data):
    filtered_by_msg_type = [entry for entry in decoded_data if is_msg_type_in_range(entry.get('msg_type'))]
    filtered_by_mmsi = [entry for entry in filtered_by_msg_type if is_valid_mmsi(entry.get('mmsi'))]
    return filtered_by_mmsi

def write_to_json(data, output_path):
    json_output = json.dumps(data)
    with open(output_path, 'w') as json_file:
        json_file.write(json_output)

base_path = pathlib.Path(__file__).parent
today_file = base_path.joinpath('input/today.txt')
yesterday_file = base_path.joinpath('input/yesterday.txt')

today_data = process_file(today_file)
yesterday_data = process_file(yesterday_file)

today_filtered = filter_data(today_data)
yesterday_filtered = filter_data(yesterday_data)

combined_data = today_filtered + yesterday_filtered

write_to_json(combined_data, base_path.joinpath('output/combined_decoded_2448.json'))
