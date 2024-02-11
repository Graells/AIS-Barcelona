
#!/bin/bash

# CMD="find /home/pi/Desktop/data_AIS -type f -name '*.txt' | xargs ls -lt | head -n 1 | awk '{print \$NF}'"
CMD="find /home/pi/Desktop/data_AIS -type f -name '*.txt' -printf '%T+ %p\n' | sort -r | head -n 1 | cut -d' ' -f2-"

LATEST_TXT=$(ssh -i /Users/xaviergraells/.ssh/id_rsa_raspberrypi_compatible pi@147.83.10.152 "$CMD")

if [ -z "$LATEST_TXT" ]; then
    echo "No .txt file found."
    exit 1
fi

scp -i /Users/xaviergraells/.ssh/id_rsa_raspberrypi_compatible "pi@147.83.10.152:$LATEST_TXT" "/Users/xaviergraells/Desktop/TFG2024/AIS-Barcelona/decoder-python/input/freshAIS.txt"

echo "Latest .txt |$LATEST_TXT| file copied to freshAIS.txt successfully."
