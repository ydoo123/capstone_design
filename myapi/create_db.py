import sqlite3
import datetime


TIME_FORMAT = "%Y-%m-%d_%H:%M:%S"


def create_db():
    """create datebase"""
    conn = sqlite3.connect("database.db")
    return None


def create_table():
    """
    Create a table.
    table_name: dest_table
    The columns contain id, cam_id, x, y, z, w, and time.

    Each data type is id: int, cam_id: int, x: float, y:float, z: float, w:float, time:str.
    """
    conn = sqlite3.connect("database.db")
    c = conn.cursor()
    c.execute(
        """CREATE TABLE dest_table
                (id integer primary key, cam_id integer, x float, y float, z float, w float, time text)"""
    )
    conn.commit()
    conn.close()
    return None

def update_table():
    """
    dest_table에 접속해서, id: 1, cam_id: 0, x: 1.0, y: 2.0, z: 3.0, w: 4.0, time: 2021-05-12_11:11:11 인 값을 넣는다.
    """
    conn = sqlite3.connect("database.db")
    c = conn.cursor()
    c.execute(
        """INSERT INTO dest_table (id, cam_id, x, y, z, w, time) VALUES (?, ?, ?, ?, ?, ?, ?)""",
        (3, 0, 1.0, 2.0, 3.0, 4.0, datetime.datetime.now().strftime(TIME_FORMAT)),
    )
    conn.commit()
    conn.close()
    return None


if __name__ == "__main__":
    # create_db()
    # create_table()
    update_table()
