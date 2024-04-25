#!/bin/bash
source .env

if ! ping -c 1 $SSH_HOST &>/dev/null; then
    echo "Raspberry Pi is not reachable. Check if it has turned off or if is connected to the internet."
    exit 1
fi

remote_path="/home/pi/Desktop/test_AIS/combined_last_12_hours.txt"
destination_path="$DESTINATION_PATH/combined_last_12_hours.txt"

if ssh -i "$SSH_KEY_PATH" "$SSH_USERNAME@$SSH_HOST" test -f "$remote_path"; then
    scp -i "$SSH_KEY_PATH" "$SSH_USERNAME@$SSH_HOST:$remote_path" "$destination_path"
    echo "Combined data file copied successfully to $destination_path."
else
    echo "No combined data file found at $remote_path."
fi
