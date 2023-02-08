import sqlite3


"""create datebase"""
def create_db():
    conn = sqlite3.connect('database.db')
    return None


"""
Create a table.
table_name: dest_table
The columns contain id, cam_id, x, y, theta, w, and time.

Each data type is id: int, cam_id: int, x: float, y:float, theta: float, w:float, time:str.
"""
def create_table():
    conn = sqlite3.connect('database.db')
    c = conn.cursor()
    c.execute('''CREATE TABLE dest_table
                (id integer primary key, cam_id integer, x float, y float, theta float, w float, time text)''')
    conn.commit()
    conn.close()
    return None


if __name__ == "__main__":
    create_db()
    create_table()
