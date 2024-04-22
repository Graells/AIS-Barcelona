from flask import Flask, send_from_directory, jsonify
import os
import subprocess
import json

app = Flask(__name__)

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

if __name__ == '__main__':
    app.run(port=5000)



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