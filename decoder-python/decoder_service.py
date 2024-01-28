from flask import Flask, send_from_directory, jsonify
import os
import subprocess
import json

app = Flask(__name__)

@app.route('/get-decoded-json', methods=['GET'])
def get_decoded_json():
    script_path = './decoder-json.py'
    result = subprocess.run(['python', script_path], capture_output=True, text=True)

    if result.returncode != 0:
        return f"Error: {result.stderr}", 500
    
    with open('output/decoded_data.json', 'r') as json_file:
        decoded_data = json.load(json_file)

    return jsonify(decoded_data)


@app.route('/get-decoded-csv', methods=['GET'])
def decode():
    script_path = './decoder-csv.py'
    result = subprocess.run(['python', script_path], capture_output=True, text=True)
    
    if result.returncode != 0:
        return f"Error: {result.stderr}", 500

    return send_from_directory('output', 'decoded_messages.csv')

if __name__ == '__main__':
    app.run(port=5000)
