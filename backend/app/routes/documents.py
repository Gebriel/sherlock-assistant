import os
import filetype

from fastapi import APIRouter, Depends, HTTPException, UploadFile 

from .. import knowledge
from ..auth import require_authentication
from ..config import UPLOAD_DIR


router = APIRouter()

def is_valid_file(data):
    file_kind = filetype.guess(data)
    if file_kind and file_kind.mime in ["application/pdf"]:
        return True
    try:
        data.decode("utf-8") # not the best idea, but I think it is enough for now until I find a better way
        return True
    except UnicodeDecodeError:
        return False


@router.post("/documents")
async def upload_document(file: UploadFile, auth: str = Depends(require_authentication)):
    data = await file.read()
    if not is_valid_file(data):
        raise HTTPException(status_code=415, detail="Invalid file type, Only pdf and plain text files")
    
    os.makedirs(UPLOAD_DIR, exist_ok=True)
    file_path = os.path.join(UPLOAD_DIR, file.filename)
    
    with open(file_path, "wb") as f:
        f.write(data)
    try:
        knowledge.ingest(file_path, file.filename)
    except Exception as e:
        os.remove(file_path) # remove saved file if ingestion into ChromaDB fails
        raise HTTPException(status_code=500, detail=f"Failed to process file: {e}")


    return {"filename": file.filename}

@router.get("/documents")
def get_documents_list(_= Depends(require_authentication)):
    if not os.path.exists(UPLOAD_DIR):
        return {"documents": []}
    
    files = []
    for f in os.listdir(UPLOAD_DIR):
        if not f.startswith("."):
            files.append(f)
    return {"documents": files}


@router.delete("/documents/{filename}")
def delete_document(filename, _=Depends(require_authentication)):
    file_path = os.path.join(UPLOAD_DIR, filename)
    if not os.path.exists(file_path):
        raise HTTPException(status_code=404, detail="File not found")
    
    knowledge.delete_knowledge(filename)
    os.remove(file_path)
    return {"deleted": filename}