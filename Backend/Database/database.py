from pymongo import MongoClient
from fastapi import FastAPI
import os
from dotenv import load_dotenv
from sqlalchemy.ext.declarative import declarative_base
from uuid import uuid4

load_dotenv()

# SQLAlchemy Base for models
Base = declarative_base()

MONGO_URL = os.getenv("MONGO_URL")

client = MongoClient(MONGO_URL)
db = client["student_db"]

room_collection = db["rooms"]

student_collection = db["students"]
print("Database Connected")
