#!/usr/bin/env python3
import time
import shutil
import datetime
import os

base_path = '/home/pi/Desktop/test_AIS/'

def cleanup_old_files(base_path):
    current_time = datetime.datetime.now()
    cutoff_time = current_time - datetime.timedelta(hours=12)
    print("Current time:", current_time)
    print("Cutoff time:", cutoff_time)

    for file_name in os.listdir(base_path):
        if file_name.endswith('_AIS.txt'):
            file_time_str = file_name[:-8]
            try:
                file_time = datetime.datetime.strptime(file_time_str, '%Y%m%d%H')
                if file_time < cutoff_time:
                    os.remove(os.path.join(base_path, file_name))
                    print("Removed old file: {}".format(file_name))
            except ValueError:
                print("Skipping invalid file: {}".format(file_name))


while True:
    current_file = os.path.join(base_path, 'AIS_15m.txt')
    to_send_file = os.path.join(base_path, 'AIS_to_send.txt')
    
    cleanup_old_files(base_path)

    time.sleep(900)  # 15 minutes 

    try:
        if os.path.exists(current_file) and os.path.getsize(current_file) > 0:
            shutil.copyfile(current_file, to_send_file)
            open(current_file, 'w').close()
            print("Data copied to AIS_to_send.txt and AIS_15m.txt cleared for the next cycle.")
        else:
            print("No data to process. Waiting for the next cycle.")
    except Exception as e:
        print("An error occurred: {}".format(e))




