
import pathlib
import json
import base64

from pyais.stream import FileReaderStream


filename = pathlib.Path(__file__).parent.joinpath('input/tags.txt')
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

def is_valid_mmsi(mmsi):
    if isinstance(mmsi, int) and (100000000 <= mmsi <= 999999999):
        return True
    return False

def is_msg_type_in_range(msg_type):
    return 1 <= msg_type <= 5

filtered_by_msg_type = [entry for entry in decoded_data_with_timestamps if is_msg_type_in_range(entry.get('msg_type'))]
filtered_by_mmsi = [entry for entry in filtered_by_msg_type if is_valid_mmsi(entry.get('mmsi'))]


json_output = json.dumps(filtered_by_mmsi)

with open('output/decoded_tags.json', 'w') as json_file:
    json_file.write(json_output)
