#!/bin/bash
source .env

ping -c 1 $SSH_HOST &>/dev/null
if [ $? -ne 0 ]; then
    echo "Raspberry Pi is not reachable. Check if it has turned off or if is connected to the internet."
    exit 1
fi

#!/bin/bash
TODAY_FILE=$(date +%Y%m%d)_24_AIS.txt
YESTERDAY_FILE=$(date -v-1d +%Y%m%d)_24_AIS.txt

echo "Today's file: $TODAY_FILE"
echo "Yesterday's file: $YESTERDAY_FILE"


CMD_TODAY="find /home/pi/Desktop/test_AIS -type f -name $TODAY_FILE"
CMD_YESTERDAY="find /home/pi/Desktop/test_AIS -type f -name $YESTERDAY_FILE"

TODAY_PATH=$(ssh -i "$SSH_KEY_PATH" "$SSH_USERNAME@$SSH_HOST" "$CMD_TODAY")
YESTERDAY_PATH=$(ssh -i "$SSH_KEY_PATH" "$SSH_USERNAME@$SSH_HOST" "$CMD_YESTERDAY")

if [ -z "$TODAY_PATH" ]; then
    echo "No file found for today."
else
    scp -i "$SSH_KEY_PATH" "$SSH_USERNAME@$SSH_HOST:$TODAY_PATH" "$DESTINATION_PATH_TODAY"
    echo "Today's file copied successfully."
fi

if [ -z "$YESTERDAY_PATH" ]; then
    echo "No file found for yesterday."
else
    scp -i "$SSH_KEY_PATH" "$SSH_USERNAME@$SSH_HOST:$YESTERDAY_PATH" "$DESTINATION_PATH_YESTERDAY"
    echo "Yesterday's file copied successfully."
fi
