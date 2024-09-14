#!/bin/bash

source .env

rsync -avz --log-file=rsync.log -e "ssh -i $SSH_KEY_PATH" $REMOTE_USER@$REMOTE_HOST:$REMOTE_DIR $LOCAL_DIR
