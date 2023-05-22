from fastapi import FastAPI
from pydantic import BaseModel
import sqlite3
import datetime
from starlette.responses import FileResponse
from starlette.staticfiles import StaticFiles
from pytz import timezone
from PIL import Image
import io
import uuid
import os


TIME_FORMAT = "%Y-%m-%d_%H:%M:%S"
KST = timezone("Asia/Seoul")


class Item(BaseModel):
    cam_id: int
    x: float
    y: float
    z: float
    w: float


app = FastAPI()
app.mount("/static", StaticFiles(directory="static"))


@app.get("/")
async def read_index():
    return FileResponse("templates/index.html")


@app.get("/HRI")
async def HRI():
    return FileResponse("templates/HRI.html")


@app.get("/quit")
def quit():
    """
    When get to /quit, update the current time in quit_table in database.db.
    """
    conn = sqlite3.connect("database.db")
    c = conn.cursor()
    c.execute(
        "INSERT INTO quit_table (time) VALUES (?)",
        (datetime.datetime.now(KST).strftime(TIME_FORMAT),),
    )
    conn.commit()
    conn.close()

    return {"message": "success"}


@app.get("/get_quit")
def get_quit():
    conn = sqlite3.connect("database.db")
    c = conn.cursor()
    c.execute("SELECT * FROM quit_table ORDER BY id DESC LIMIT 1")
    result = c.fetchone()
    conn.close()

    quit_dict = dict(zip([x[0] for x in c.description], result))

    return quit_dict


@app.post("/upload_dest")
def upload_dest(item: Item):
    """
    When you post to /upload_dest, it receives the json data
    and inserts the json data into the dest_table in database.db.
    """
    conn = sqlite3.connect("database.db")
    c = conn.cursor()
    c.execute(
        "INSERT INTO dest_table (cam_id, x, y, z, w, time) VALUES (?, ?, ?, ?, ?, ?)",  # noqa: E501
        (
            item.cam_id,
            item.x,
            item.y,
            item.z,
            item.w,
            datetime.datetime.now(KST).strftime(TIME_FORMAT),
        ),
    )
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


@app.post("/upload_image")
async def upload_image(image: bytes):
    img = Image.open(io.BytesIO(image))

    img_name = str(uuid.uuid4()) + ".jpg"
    img_path = os.path.join("static", "images", "fall", img_name)

    # save img to img_path
    img.save(img_path)

    conn = sqlite3.connect("database.db")
    c = conn.cursor()
    c.execute(
        "INSERT INTO image_table (name, path, time) VALUES (?, ?, ?)",  # noqa: E501
        (
            img_name,
            img_path,
            datetime.datetime.now(KST).strftime(TIME_FORMAT),
        ),
    )
    conn.commit()
    conn.close()

    return {"message": "success"}
