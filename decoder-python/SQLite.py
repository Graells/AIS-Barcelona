import sqlite3

def create_database():
    conn = sqlite3.connect('decoded_data.db')
    cursor = conn.cursor()
    
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS vessels (
            mmsi INTEGER PRIMARY KEY,
            name TEXT DEFAULT '',
            lat REAL,
            lon REAL,
            lastUpdateTime INTEGER,
            destination TEXT DEFAULT '',
            callsign TEXT DEFAULT '',
            speed REAL,
            ship_type INTEGER DEFAULT 0
        )
    ''')

    cursor.execute('''
        CREATE TABLE IF NOT EXISTS positions (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            mmsi INTEGER,
            timestamp INTEGER,
            lat REAL,
            lon REAL,
            FOREIGN KEY(mmsi) REFERENCES vessels(mmsi),
            UNIQUE(mmsi, timestamp),
            UNIQUE(mmsi, lat, lon)
        )
    ''')

    cursor.execute('''
        CREATE INDEX IF NOT EXISTS idx_positions_timestamp 
        ON positions (timestamp);
    ''')

    cursor.execute('''
        CREATE INDEX IF NOT EXISTS idx_vessels_lastUpdateTime 
        ON vessels (lastUpdateTime);
    ''')

    conn.commit()
    conn.close()

create_database()

