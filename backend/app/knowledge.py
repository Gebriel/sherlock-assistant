import os

from agno.knowledge.embedder.huggingface import HuggingfaceCustomEmbedder
from agno.knowledge.knowledge import Knowledge
from agno.vectordb.chroma import ChromaDb

from .config import CHROMA_DIR

os.makedirs(CHROMA_DIR, exist_ok=True)

vector_db = ChromaDb(
    collection= 'case_files',
    path=CHROMA_DIR,
    persistent_client=True,
    embedder=HuggingfaceCustomEmbedder()
)


knowledge = Knowledge(name="case_files", vector_db=vector_db)

def ingest(filepath, filename):
    knowledge.insert(name=filename, path=filepath, skip_if_exists=True)


def delete_knowledge(filename):
    vector_db.delete_by_name(filename)