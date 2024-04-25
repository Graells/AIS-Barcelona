#!/usr/bin/env python3
import time
import shutil
import datetime
import os
import logging

logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')

base_path = '/home/pi/Desktop/test_AIS/'
combined_file_path = '/home/pi/Desktop/test_AIS/combined_last_12_hours.txt'

def cleanup_old_files(base_path, cutoff_time):
    for file_name in os.listdir(base_path):
        if file_name.endswith('_AIS.txt'):
            file_time_str = file_name[:-8]
            try:
                file_time = datetime.datetime.strptime(file_time_str, '%Y%m%d%H')
                if file_time < cutoff_time:
                    os.remove(os.path.join(base_path, file_name))
                    logging.info("Removed old file: {}".format(file_name))
            except ValueError:
                logging.warning("Skipping invalid file: {}".format(file_name))

def combine_recent_files(base_path, cutoff_time):
    with open(combined_file_path, 'w') as outfile:
        for file_name in sorted(os.listdir(base_path)):
            if file_name.endswith('_AIS.txt'):
                file_time_str = file_name[:-8]
                try:
                    file_time = datetime.datetime.strptime(file_time_str, '%Y%m%d%H')
                    if file_time >= cutoff_time:
                        file_path = os.path.join(base_path, file_name)
                        with open(file_path, 'r') as readfile:
                            shutil.copyfileobj(readfile, outfile)
                        logging.info("Added file to combined file: {}".format(file_name))
                except ValueError:
                    logging.warning("Skipping invalid file: {}".format(file_name))

while True:
    current_time = datetime.datetime.now()
    cutoff_time = current_time - datetime.timedelta(hours=12)
    logging.info("Current time: {}".format(current_time))
    logging.info("Cutoff time: {}".format(cutoff_time))

    cleanup_old_files(base_path, cutoff_time)
    combine_recent_files(base_path, cutoff_time)

    time.sleep(30) # Sleep for 30 seconds
