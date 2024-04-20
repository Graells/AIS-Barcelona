#!/usr/bin/env python3
import time
import shutil
import os
import datetime

base_path = '/home/pi/Desktop/test_AIS/'

def cleanup_old_files(base_path):
    today = datetime.datetime.now().strftime('%Y%m%d')
    yesterday = (datetime.datetime.now() - datetime.timedelta(days=1)).strftime('%Y%m%d')

    today_file = os.path.join(base_path, f'{today}_24_AIS.txt')
    yesterday_file = os.path.join(base_path, f'{yesterday}_24_AIS.txt')

    if not os.path.exists(today_file):
        open(today_file, 'a').close()

    for file_name in os.listdir(base_path):
        if file_name.endswith('_24_AIS.txt') and file_name not in {os.path.basename(today_file), os.path.basename(yesterday_file)}:
            os.remove(os.path.join(base_path, file_name))



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




