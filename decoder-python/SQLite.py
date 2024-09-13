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

    conn.commit()
    conn.close()

create_database()

