import pathlib
import json
import base64

from pyais.stream import FileReaderStream

def process_data(filenames):
    decoded_data_with_timestamps = []
    for filename in filenames:
        with FileReaderStream(str(filename)) as file_reader:
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
    if isinstance(mmsi, int) and (100000000 <= mmsi <= 999999999):
        return True
    return False

def is_msg_type_in_range(msg_type):
    return 1 <= msg_type <= 5

def filter_data(decoded_data):
    return [
        entry for entry in decoded_data
        if is_msg_type_in_range(entry.get('msg_type')) and is_valid_mmsi(entry.get('mmsi'))
    ]

def write_to_json(data, output_path):
    json_output = json.dumps(data)
    with open(output_path, 'w') as json_file:
        json_file.write(json_output)

def read_and_combine_files(*filenames):
    combined_data = []
    for filename in filenames:
        with FileReaderStream(str(filename)) as file_reader:
            combined_data.extend(file_reader)
    return combined_data

base_path = pathlib.Path(__file__).parent
today_file = base_path.joinpath('input/today.txt')
yesterday_file = base_path.joinpath('input/yesterday.txt')

# Read and combine raw file contents before processing
combined_raw_data = read_and_combine_files(today_file, yesterday_file)

# Process the combined raw data
processed_data = process_data(combined_raw_data)

# Filter the processed data
filtered_data = filter_data(processed_data)

# Write the filtered data to JSON
output_path = base_path.joinpath('output/combined_decoded_2448.json')
write_to_json(filtered_data, output_path)
