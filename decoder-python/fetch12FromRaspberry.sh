#!/bin/bash
source .env

if ! ping -c 1 $SSH_HOST &>/dev/null; then
    echo "Raspberry Pi is not reachable. Check if it has turned off or if is connected to the internet."
    exit 1
fi

remote_path="/home/pi/Desktop/test_AIS/combined_last_12_hours.txt"
destination_path="$DESTINATION_PATH/combined_last_12_hours.txt"
flag_path="/home/pi/Desktop/test_AIS/ready_to_transfer.txt"

if ssh -i "$SSH_KEY_PATH" "$SSH_USERNAME@$SSH_HOST" test -f "$flag_path"; then
    if ssh -i "$SSH_KEY_PATH" "$SSH_USERNAME@$SSH_HOST" test -f "$remote_path"; then
        scp -i "$SSH_KEY_PATH" "$SSH_USERNAME@$SSH_HOST:$remote_path" "$destination_path"
        echo "Combined data file copied successfully to $destination_path."
        ssh -i "$SSH_KEY_PATH" "$SSH_USERNAME@$SSH_HOST" rm "$flag_path"
        echo "Flag file removed after successful transfer."
    else
        echo "No combined data file found at $remote_path."
    fi
else
    echo "Data file is not ready for transfer."
fi


# if ssh -i "/home/ais/.ssh/id_rsa_raspberrypi_ed25519" "pi@147.83.10.152" test -f "$flag_path"; then
#     if ssh -i "/home/ais/.ssh/id_rsa_raspberrypi_ed25519" "pi@147.83.10.152" test -f "$remote_path"; then
#         scp -i "/home/ais/.ssh/id_rsa_raspberrypi_ed25519" "pi@147.83.10.152:$remote_path" "$destination_path"
#         echo "Combined data file copied successfully to $destination_path."
#         ssh -i "/home/ais/.ssh/id_rsa_raspberrypi_ed25519" "pi@147.83.10.152" rm "$flag_path"
#         echo "Flag file removed after successful transfer."
#     else
#         echo "No combined data file found at $remote_path."
#     fi
# else
#     echo "Data file is not ready for transfer."
# fi