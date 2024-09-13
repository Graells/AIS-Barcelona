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
        
def format_datetime(dt):
    return int(time.mktime(dt.timetuple()))

def query_vessels_by_time(cursor, time_condition):
    query = '''
        SELECT * FROM vessels
        WHERE lastUpdateTime IS NOT NULL AND lastUpdateTime >= ?
    '''
    cursor.execute(query, (time_condition,))
    return [dict(row) for row in cursor.fetchall()]

@app.route('/get-vessels', methods=['GET'])
def get_vessels():
    twenty_four_hours_ago = format_datetime(datetime.now() - timedelta(hours=24))
    with get_db_connection() as conn:
        vessels = query_vessels_by_time(conn.cursor(), twenty_four_hours_ago)
    return jsonify(vessels)

@app.route('/get-current-vessels', methods=['GET'])
def get_current_vessels():
    one_hour_ago = format_datetime(datetime.now() - timedelta(hours=1, minutes=1))
    with get_db_connection() as conn:
        vessels = query_vessels_by_time(conn.cursor(), one_hour_ago)
    return jsonify(vessels)


@app.route('/get-vessel-positions/<int:mmsi>', methods=['GET'])
def get_positions(mmsi):
    query = 'SELECT timestamp, lat, lon FROM positions WHERE mmsi = ? ORDER BY timestamp ASC'
    with get_db_connection() as conn:
        cursor = conn.cursor()
        cursor.execute(query, (mmsi,))
        rows = cursor.fetchall()
    positions = [{'timestamp': row['timestamp'], 'lat': row['lat'], 'lon': row['lon']} for row in rows]
    return jsonify(positions)

@app.route('/get-vessel-last12h-positions/<int:mmsi>', methods=['GET'])
def get_recent_positions(mmsi):
    twelve_hours_ago = format_datetime(datetime.now() - timedelta(hours=12))
    query = '''
        SELECT timestamp, lat, lon FROM positions
        WHERE mmsi = ? AND timestamp >= ?
    '''
    with get_db_connection() as conn:
        cursor = conn.cursor()
        cursor.execute(query, (mmsi, twelve_hours_ago))
        rows = cursor.fetchall()
    positions = [{'timestamp': row['timestamp'], 'lat': row['lat'], 'lon': row['lon']} for row in rows]
    return jsonify(positions)

@app.route('/get-vessel/<int:mmsi>', methods=['GET'])
def get_vessel_info(mmsi):
    query = '''
        SELECT mmsi, name, lat, lon, speed, callsign, ship_type, destination, lastUpdateTime
        FROM vessels
        WHERE mmsi = ?
    '''
    with get_db_connection() as conn:
        cursor = conn.cursor()
        cursor.execute(query, (mmsi,))
        row = cursor.fetchone()
    if row:
        vessel_info = {key: row[key] for key in row.keys()}
        return jsonify(vessel_info)
    else:
        return jsonify({"error": "Vessel not found"}), 404


@app.route('/get-vessels-by-date/<date>', methods=['GET'])
def get_vessels_by_date(date):
    try:
        start_datetime = datetime.strptime(date, '%Y%m%d')
        end_datetime = start_datetime + timedelta(days=1)
        with get_db_connection() as conn:
            cursor = conn.cursor()
            cursor.execute('''
                SELECT * FROM vessels
                WHERE lastUpdateTime >= ? AND lastUpdateTime < ?
            ''', (format_datetime(start_datetime), format_datetime(end_datetime)))
            vessels = [dict(row) for row in cursor.fetchall()]
        return jsonify(vessels)
    except ValueError as e:
        return jsonify({"error": str(e)}), 400



if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, threaded=True)
