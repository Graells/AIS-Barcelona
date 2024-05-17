from datetime import datetime, timedelta
import sqlite3
import logging

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

def get_db_connection():
    return sqlite3.connect('decoded_data.db')

def cleanup_old_data():
    with get_db_connection() as conn:
        try:
            cursor = conn.cursor()
            deadline = (datetime.now() - timedelta(hours=96)).strftime('%Y%m%d%H%M%S')

            cursor.execute('''
                DELETE FROM vessels
                WHERE lastUpdateTime < ?
            ''', (deadline,))

            cursor.execute('''
                DELETE FROM positions
                WHERE timestamp < ?
            ''', (deadline,))

            conn.commit()
        except Exception as e:
            logger.error(f"Error cleaning up old data: {e}")
            conn.rollback()
            raise e

if __name__ == "__main__":
    cleanup_old_data()
