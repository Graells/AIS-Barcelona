from flask import Flask, Response, jsonify
import os
import subprocess
import json

app = Flask(__name__)

def fetch2448FromRaspberry():
    script_path = './fetch2448FromRaspberry.sh'
    result = subprocess.run(script_path, shell=True, capture_output=True, text=True)
    
    if result.returncode != 0:
        error_output = result.stderr.strip() if result.stderr else result.stdout.strip()
        print(f"Script Error: {error_output}")
        return f"Error: {error_output}", 500
    else:
        print(f"Script Output: {result.stdout}")
        return "Success"

@app.route('/get-decoded-2448', methods=['GET'])
def get_decoded_2448():
    fetch_result = fetch2448FromRaspberry()
    if fetch_result != "Success":
        return fetch_result

    script_path = './decoder-2448.py'
    result = subprocess.run(['python3', script_path], capture_output=True, text=True)

    if result.returncode != 0:
        return f"Error: {result.stderr}", 500

    def generate():
        with open('output/combined_decoded_2448.json', 'r') as json_file:
            while True:
                chunk = json_file.read(1024)  # Read chunks of 1024 bytes
                if not chunk:
                    break
                yield chunk
    
    return Response(generate(), mimetype='application/json')

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, threaded=True)
