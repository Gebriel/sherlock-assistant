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


@router.post("/documentts")
async def upload_document(file: UploadFile, auth: str = Depends(require_authentication)):
    data = await file.read()
    if not is_valid_file(data):
        raise HTTPException(status_code=400, detail="Invalid file type")
    
    os.makedirs(UPLOAD_DIR, exist_ok=True)
    file_path = os.path.join(UPLOAD_DIR, file.filename)
    
    with open(file_path, "wb") as f:
        f.write(data)
    try:
        knowledge.add_knowledge(file_path, file.filename)
    except Exception as e:
        os.remove(file_path)
        raise HTTPException(status_code=500, detail=f"Filed to process file: {e}")


    return {"filename": file.filename}

@router.get("/documents")
def get_documents_list(auth: str = Depends(require_authentication)):
    if not os.path.exists(UPLOAD_DIR):
        return {"documents": []}
    
    files = []
    for f in os.listdir(UPLOAD_DIR):
        if not f.startswith("."):
            files.append(f)
    return {"documents": files}