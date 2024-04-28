import sqlite3

def create_database():
    conn = sqlite3.connect('decoded_data.db')  
    cursor = conn.cursor()
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS decoded_data (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            mmsi INTEGER UNIQUE,
            data JSON
        )
    ''')
    conn.commit()
    conn.close()

create_database()
