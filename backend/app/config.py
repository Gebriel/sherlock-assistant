import os

from dotenv import load_dotenv

load_dotenv()

GOOGLE_API_KEY = os.getenv("GOOGLE_API_KEY")
HF_TOKEN = os.getenv("HF_TOKEN")
USERNAME = os.getenv("USERNAME", "detective")
PASSWORD = os.getenv("PASSWORD", "sherlock")
UPLOAD_DIR = os.getenv("UPLOAD_DIR", "./uploads")
CHROMA_DIR = os.getenv("CHROMA_DIR", "./chroma")
