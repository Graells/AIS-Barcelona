from datetime import datetime, timedelta
from flask import Flask, jsonify
import sqlite3
from flask_cors import CORS
import time

app = Flask(__name__)
CORS(app)

def get_db_connection():
    """Create and return a connection to the database."""
    conn = sqlite3.connect('decoded_data.db')
    conn.row_factory = sqlite3.Row
    return conn

def parse_timestamp(timestamp):
    """Parse the given timestamp into ISO 8601 format."""
    try:
        return datetime.strptime(timestamp, '%Y%m%d%H%M%S').isoformat()
    except ValueError:
        try:
            return datetime.strptime(timestamp.split(':')[1], '%Y%m%d%H%M%S').isoformat()
        except ValueError:
            return None

@app.route('/get-vessels', methods=['GET'])
def get_vessels():
    conn = get_db_connection()
    cursor = conn.cursor()
    try:
        twenty_four_hours_ago = (datetime.now() - timedelta(hours=24)).strftime('%Y%m%d%H%M%S')
        cursor.execute('''
            SELECT * FROM vessels
            WHERE lastUpdateTime IS NOT NULL AND lastUpdateTime >= ?
        ''', (twenty_four_hours_ago,))
        vessels = [dict(row) for row in cursor.fetchall()]
        return jsonify(vessels)
    finally:
        conn.close()

@app.route('/get-current-vessels', methods=['GET'])
def get_current_vessels():
    conn = get_db_connection()
    cursor = conn.cursor()
    try:
        one_hour_ago = (datetime.now() - timedelta(hours=1, minutes=1)).strftime('%Y%m%d%H%M%S')
        cursor.execute('''
            SELECT * FROM vessels
            WHERE lastUpdateTime IS NOT NULL AND lastUpdateTime >= ?
        ''', (one_hour_ago,))
        vessels = [dict(row) for row in cursor.fetchall()]
        return jsonify(vessels)
    finally:
        conn.close()


@app.route('/get-vessel-positions/<int:mmsi>', methods=['GET'])
def get_positions(mmsi):
    conn = get_db_connection()
    cursor = conn.cursor()
    try:
        cursor.execute('SELECT timestamp, lat, lon FROM positions WHERE mmsi = ? ORDER BY timestamp ASC', (mmsi,))
        rows = cursor.fetchall()
        positions = [{'timestamp': row['timestamp'], 'lat': row['lat'], 'lon': row['lon']} for row in rows]
        return jsonify(positions)
    finally:
        conn.close()

@app.route('/get-vessel-last12h-positions/<int:mmsi>', methods=['GET'])
def get_recent_positions(mmsi):
    conn = get_db_connection()
    cursor = conn.cursor()
    try:
        twelve_hours_ago = (datetime.now() - timedelta(hours=12)).strftime('%Y%m%d%H%M%S')
        cursor.execute('''
            SELECT timestamp, lat, lon FROM positions
            WHERE mmsi = ? AND timestamp >= ?
        ''', (mmsi, twelve_hours_ago))
        positions = [{'timestamp': row['timestamp'], 'lat': row['lat'], 'lon': row['lon']} 
                     for row in cursor.fetchall()]
        return jsonify(positions)
    finally:
        conn.close()

@app.route('/get-vessel/<int:mmsi>', methods=['GET'])
def get_vessel_info(mmsi):
    conn = get_db_connection()
    cursor = conn.cursor()
    try:
        cursor.execute('''
            SELECT mmsi, name, lat, lon, speed, callsign, ship_type, destination, lastUpdateTime
            FROM vessels
            WHERE mmsi = ?
        ''', (mmsi,))
        row = cursor.fetchone()
        if row:
            vessel_info = {
                "mmsi": row['mmsi'],
                "name": row['name'],
                "callsign": row['callsign'],
                "ship_type": row['ship_type'],
                "destination": row['destination'],
                "lastUpdateTime": row['lastUpdateTime'],
                "speed": row['speed'],
                "lat": row['lat'],
                "lon": row['lon']
            }
            return jsonify(vessel_info)
        else:
            return jsonify({"error": "Vessel not found"}), 404
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    finally:
        conn.close()


@app.route('/get-vessels-by-date/<start_date>/<end_date>', methods=['GET'])
def get_vessels_by_date(start_date, end_date):
    conn = get_db_connection()
    cursor = conn.cursor()
    try:
        start_datetime = datetime.strptime(start_date, '%Y%m%d').strftime('%Y%m%d%H%M%S')
        end_datetime = datetime.strptime(end_date, '%Y%m%d').strftime('%Y%m%d%H%M%S')
        
        cursor.execute('''
            SELECT * FROM vessels
            WHERE lastUpdateTime >= ? AND lastUpdateTime <= ?
        ''', (start_datetime, end_datetime))
        
        vessels = [dict(row) for row in cursor.fetchall()]
        return jsonify(vessels)
    except ValueError as e:
        return jsonify({"error": str(e)}), 
    finally:
        conn.close()


if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, threaded=True)
