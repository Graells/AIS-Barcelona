#!/bin/bash
source .env

ping -c 1 $SSH_HOST &>/dev/null
if [ $? -ne 0 ]; then
    echo "Raspberry Pi is not reachable. Check if it has turned off or if is connected to the internet."
    exit 1
fi


copy_files() {
    local hour_offset=$1
    # LOCAL:
    local file_date=$(date -v -${hour_offset}H +%Y%m%d%H)_AIS.txt
    # UBUNTU:
    # local file_date=$(date -d "now -${hour_offset} hour" +%Y%m%d%H)_AIS.txt
    echo "File date: $file_date"
    local remote_path="/home/pi/Desktop/test_AIS/$file_date"
    echo "Remote path: $remote_path"

    echo "Checking for file: $file_date"

    if ssh -i "$SSH_KEY_PATH" "$SSH_USERNAME@$SSH_HOST" test -f "$remote_path"; then
        local destination_path="$DESTINATION_PATH/${file_date}"
        echo "Destination path: $destination_path"
        scp -i "$SSH_KEY_PATH" "$SSH_USERNAME@$SSH_HOST:$remote_path" "$destination_path"
        echo "$file_date copied successfully to $destination_path."
    else
        echo "No file found for $file_date."
    fi
}

for hour in {0..11}
do
    copy_files $hour
done
