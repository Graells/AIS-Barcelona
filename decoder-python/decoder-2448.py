import pathlib
import json
import base64

from pyais.stream import FileReaderStream

def process_data_and_write(combined_file, output_path):
    print("Processing data...")
    with open(output_path, 'w') as json_file:
        json_file.write('[')  # Start JSON array
        first_item = True
        for msg in FileReaderStream(combined_file):
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

                # Separate JSON objects with a comma except for the first
                if not first_item:
                    json_file.write(',')
                else:
                    first_item = False

                # Dump the dictionary to JSON file
                json.dump(decoded_dict, json_file)

            except Exception as e:
                print(f"Error decoding message: {msg}. Error: {e}")
        json_file.write(']')  # End JSON array

def is_valid_mmsi(mmsi):
    return isinstance(mmsi, int) and (100000000 <= mmsi <= 999999999)

def is_msg_type_in_range(msg_type):
    return 1 <= msg_type <= 5

def read_and_combine_files(*filenames, output_file):
    print("Reading files...")
    combined_data = []
    try:
        for filename in filenames:
            print(f"Opening file: {filename}")
            with open(filename, 'r') as file:
                combined_data.extend(file.readlines())
        
        print("Files read and combined successfully.")
        
        with open(output_file, 'w') as output:
            output.writelines(combined_data)
            print(f"Combined data written to {output_file}")
    except Exception as e:
        print(f"Error reading or combining files: {e}")

if __name__ == "__main__":
    base_path = pathlib.Path(__file__).parent
    today_file = base_path.joinpath('input/today.txt')
    yesterday_file = base_path.joinpath('input/yesterday.txt')
    combined_file = base_path.joinpath('input/combined.txt')
    output_path = base_path.joinpath('output/combined_decoded_2448.json')

    print("Starting process...")
    read_and_combine_files(today_file, yesterday_file, output_file=combined_file)
    print("Files read and combined.")

    process_data_and_write(combined_file, output_path)
    print("Data processed and written to JSON.")
