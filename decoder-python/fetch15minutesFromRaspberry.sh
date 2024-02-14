
#!/bin/bash

CMD="find /home/pi/Desktop/test_AIS -type f -name 'AIS_to_send.txt'"

LATEST_15=$(ssh -i /Users/xaviergraells/.ssh/id_rsa_raspberrypi_compatible pi@147.83.10.152 "$CMD")

echo $LATEST_15

if [ -z "$LATEST_15" ]; then
    echo "No AIS_to_send.txt file found."
    exit 1
fi

scp -i /Users/xaviergraells/.ssh/id_rsa_raspberrypi_compatible "pi@147.83.10.152:$LATEST_15" "/Users/xaviergraells/Desktop/TFG2024/AIS-Barcelona/decoder-python/input/tags.txt"

echo "Latest .txt |$LATEST_TXT| file copied to tags.txt successfully."
