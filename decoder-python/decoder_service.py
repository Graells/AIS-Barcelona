from datetime import datetime, timedelta
from flask import Flask, jsonify
import json
import pathlib
from flask_cors import CORS
import sqlite3

app = Flask(__name__)
CORS(app)

def get_db_connection():
    """Create and return a connection to the database."""
    conn = sqlite3.connect('decoded_data.db')
    conn.row_factory = sqlite3.Row
    return conn

@app.route('/get-database', methods=['GET'])
def get_database():
    """Endpoint to retrieve processed vessel data from the database."""
    conn = get_db_connection()
    cursor = conn.cursor()
    try:
        cursor.execute('SELECT data FROM decoded_data')
        records = cursor.fetchall()
        vessel_data = [json.loads(row['data']) for row in records]
        return jsonify(vessel_data)
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    finally:
        conn.close()

@app.route('/get-current-vessels', methods=['GET'])
def get_recent_updates():
    """Endpoint to retrieve recent vessel data based on lastUpdateTime."""
    conn = get_db_connection()
    cursor = conn.cursor()
    try:
        one_hour_ago = datetime.now() - timedelta(hours=1)

        cursor.execute('SELECT data FROM decoded_data')
        records = cursor.fetchall()
        recent_vessels = [
            json.loads(row['data']) for row in records 
            if 'lastUpdateTime' in json.loads(row['data']) and 
               datetime.strptime(json.loads(row['data'])['lastUpdateTime'], '%Y%m%d%H%M%S') >= one_hour_ago
        ]
        return jsonify(recent_vessels)
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    finally:
        conn.close()

def parse_timestamp(timestamp):
    try:
        return datetime.strptime(timestamp, '%Y%m%d%H%M%S')
    except ValueError:
        try:
            return datetime.strptime(timestamp.split(':')[1], '%Y%m%d%H%M%S')
        except ValueError:
            return None
        
@app.route('/get-last-12-hours', methods=['GET'])
def get_last_12_hours():
    conn = get_db_connection()
    cursor = conn.cursor()
    try:
        twelve_hours_ago = datetime.now() - timedelta(hours=12)
        one_hour_ago = datetime.now() - timedelta(hours=1)
        cursor.execute('SELECT data FROM decoded_data')
        records = cursor.fetchall()

        vessels_with_recent_updates_and_positions = []
        for row in records:
            vessel = json.loads(row[0])
            last_update_time = vessel.get('lastUpdateTime')
            if last_update_time:
                last_update_datetime = parse_timestamp(last_update_time)
                if last_update_datetime < one_hour_ago:
                    continue

            filtered_positions = [
                pos for pos in vessel.get('positions', [])
                if parse_timestamp(pos['timestamp']) and parse_timestamp(pos['timestamp']) >= twelve_hours_ago
            ]

            if filtered_positions:
                vessel['positions'] = filtered_positions
                vessels_with_recent_updates_and_positions.append(vessel)

        return jsonify(vessels_with_recent_updates_and_positions)
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    finally:
        conn.close()

@app.route('/get-decoded-2448', methods=['GET'])
def get_decoded_2448():
    """Endpoint to retrieve processed vessel data."""
    base_path = pathlib.Path(__file__).parent
    output_path = base_path / 'output' / 'combined_decoded_2448.json'

    try:
        with open(output_path, 'r') as json_file:
            decoded_data = json.load(json_file)
        return jsonify(decoded_data)
    except FileNotFoundError:
        return jsonify({"error": "Requested file not found"}), 404
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, threaded=True)
