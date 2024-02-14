
#!/bin/bash
source .env

ping -c 1 $SSH_HOST &>/dev/null
if [ $? -ne 0 ]; then
    echo "Raspberry Pi is not reachable. Check if it has turned off or if is connected to the internet."
    exit 1
fi

CMD="find /home/pi/Desktop/test_AIS -type f -name 'AIS_to_send.txt'"

LATEST_15=$(ssh -i "$SSH_KEY_PATH" "$SSH_USERNAME@$SSH_HOST" "$CMD")

echo $LATEST_15

if [ -z "$LATEST_15" ]; then
    echo "No AIS_to_send.txt file found."
    exit 1
fi

scp -i "$SSH_KEY_PATH" "$SSH_USERNAME@$SSH_HOST:$LATEST_15" "$DESTINATION_PATH_15"

echo "Latest .txt |$LATEST_TXT| file copied to tags.txt successfully."
