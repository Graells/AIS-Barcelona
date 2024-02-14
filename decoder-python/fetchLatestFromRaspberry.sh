
#!/bin/bash
source .env

ping -c 1 $SSH_HOST &>/dev/null
if [ $? -ne 0 ]; then
    echo "Raspberry Pi is not reachable. Check if it has turned off or if is connected to the internet."
    exit 1
fi

CMD="find /home/pi/Desktop/data_AIS -type f -name '*.txt' -printf '%T+ %p\n' | sort -r | head -n 1 | cut -d' ' -f2-"
# CMD="find /home/pi/Desktop/data_AIS -type f -name '*.txt' | xargs ls -lt | head -n 1 | awk '{print \$NF}'"

LATEST_TXT=$(ssh -i "$SSH_KEY_PATH" "$SSH_USERNAME@$SSH_HOST" "$CMD")

if [ -z "$LATEST_TXT" ]; then
    echo "No .txt file found."
    exit 1
fi

scp -i "$SSH_KEY_PATH" "$SSH_USERNAME@$SSH_HOST:$LATEST_TXT" "$DESTINATION_PATH"

echo "Latest .txt |$LATEST_TXT| file copied to freshAIS.txt successfully."
