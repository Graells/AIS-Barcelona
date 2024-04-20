from flask import Flask, send_from_directory, jsonify
import os
import subprocess
import json

app = Flask(__name__)

@app.route('/get-decoded-json', methods=['GET'])
def get_decoded_json():
    fetch_result = fetchLatestFromRaspberry()
    if fetch_result != "Success":
        return fetch_result

    script_path = './decoder-json.py'
    result = subprocess.run(['python', script_path], capture_output=True, text=True)

    if result.returncode != 0:
        return f"Error: {result.stderr}", 500
    
    with open('output/decoded_data.json', 'r') as json_file:
        decoded_data = json.load(json_file)

    return jsonify(decoded_data)

@app.route('/get-decoded-tags', methods=['GET'])
def get_decoded_15():
    fetch_result = fetch15minutesFromRaspberry()
    if fetch_result != "Success":
        return fetch_result

    script_path = './decoder-tags.py'
    result = subprocess.run(['python', script_path], capture_output=True, text=True)

    if result.returncode != 0:
        return f"Error: {result.stderr}", 500
    
    with open('output/decoded_tags.json', 'r') as json_file:
        decoded_data = json.load(json_file)

    return jsonify(decoded_data)

@app.route('/get-decoded-2448', methods=['GET'])
def get_decoded_2448():
    fetch_result = fetch2448FromRaspberry()
    if fetch_result != "Success":
        return fetch_result

    script_path = './decoder-2448.py'
    result = subprocess.run(['python', script_path], capture_output=True, text=True)

    if result.returncode != 0:
        return f"Error: {result.stderr}", 500
    
    with open('output/combined_decoded_2448.json', 'r') as json_file:
        decoded_data = json.load(json_file)

    return jsonify(decoded_data)


@app.route('/get-decoded-csv', methods=['GET'])
def decode():
    fetch_result = fetchLatestFromRaspberry()
    if fetch_result != "Success":
        return fetch_result
    
    script_path = './decoder-csv.py'
    result = subprocess.run(['python', script_path], capture_output=True, text=True)
    
    if result.returncode != 0:
        return f"Error: {result.stderr}", 500

    return send_from_directory('output', 'decoded_messages.csv')

if __name__ == '__main__':
    app.run(port=5000)


def fetchLatestFromRaspberry():
    script_path = './fetchLatestFromRaspberry.sh'
    result = subprocess.run([script_path], shell=True, capture_output=True, text=True)
    
    if result.returncode != 0:
        error_output = result.stderr.strip() if result.stderr else result.stdout.strip()
        print(f"Script Error: {error_output}")
        return f"Error: {error_output}", 500
    else:
        print(f"Script Output: {result.stdout}")
        return "Success"

def fetch15minutesFromRaspberry():
    script_path = './fetch15minutesFromRaspberry.sh'
    result = subprocess.run([script_path], shell=True, capture_output=True, text=True)
    
    if result.returncode != 0:
        error_output = result.stderr.strip() if result.stderr else result.stdout.strip()

        print(f"Script Error: {error_output}")
        return f"Error: {error_output}", 500
    else:
        print(f"Script Output: {result.stdout}")
        return "Success"

def fetch2448FromRaspberry():
    script_path = './fetch2448FromRaspberry.sh'
    result = subprocess.run([script_path], shell=True, capture_output=True, text=True)
    
    if result.returncode != 0:
        error_output = result.stderr.strip() if result.stderr else result.stdout.strip()

        print(f"Script Error: {error_output}")
        return f"Error: {error_output}", 500
    else:
        print(f"Script Output: {result.stdout}")
        return "Success"