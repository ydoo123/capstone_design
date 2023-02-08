from fastapi import FastAPI
from pydantic import BaseModel
import sqlite3
import datetime


TIME_FORMAT = "%Y-%m-%d %H:%M:%S"


class Item(BaseModel):
    cam_id: int
    x: float
    y: float
    theta: float
    w: float


app = FastAPI()


"""
When you post to /upload_dest, it receives the json data and inserts the json data into the dest_table in database.db.
"""
@app.post("/upload_dest")
def upload_dest(item: Item):
    conn = sqlite3.connect('database.db')
    c = conn.cursor()
    c.execute("INSERT INTO dest_table (cam_id, x, y, theta, w, time) VALUES (?, ?, ?, ?, ?, ?)",
            (item.cam_id, item.x, item.y, item.theta, item.w, datetime.datetime.now().strftime(TIME_FORMAT)))
    conn.commit()
    conn.close()
    return {"message": "success"}


@app.get("/get_dest")
def get_dest():
    conn = sqlite3.connect("database.db")
    c = conn.cursor()
    c.execute("SELECT * FROM dest_table ORDER BY id DESC LIMIT 1")
    result = c.fetchone()
    conn.close()
    
    dest_dict = dict(zip([x[0] for x in c.description], result))

    return dest_dict
