#!/usr/bin/env python3
import time
import shutil
import os
import datetime

base_path = '/home/pi/Desktop/test_AIS/'

while True:
    current_file = os.path.join(base_path, 'AIS_15m.txt')
    to_send_file = os.path.join(base_path, 'AIS_to_send.txt')

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

