import sqlite3

def create_database():
    conn = sqlite3.connect('decoded_data.db')
    cursor = conn.cursor()
    
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS vessels (
            mmsi INTEGER PRIMARY KEY,
            name TEXT,
            lat REAL,
            lon REAL,
            lastUpdateTime TEXT,
            destination TEXT,
            callsign TEXT,
            speed REAL,
            ship_type INTEGER
        )
    ''')

    cursor.execute('''
        CREATE TABLE IF NOT EXISTS positions (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            mmsi INTEGER,
            timestamp TEXT,
            lat REAL,
            lon REAL,
            FOREIGN KEY(mmsi) REFERENCES vessels(mmsi),
            UNIQUE(mmsi, timestamp),
            UNIQUE(mmsi, lat, lon)
        )
    ''')

    conn.commit()
    conn.close()

create_database()

