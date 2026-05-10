from agno.agent import Agent, RunOutput
from agno.models.google import Gemini
from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel

from .. import knowledge as knlg
from ..auth import require_authentication
from ..config import GOOGLE_API_KEY

router = APIRouter()

class QueryRequest(BaseModel):
    question: str


agent = Agent(
    model=Gemini(id="gemini-2.5-flash", api_key=GOOGLE_API_KEY),
    knowledge=knlg.knowledge,
    search_knowledge=True,
    instructions=[
        "You are  a detective's assistant.",
        "Answer ONLY using information found in the case files.",
        "If you cannot find a direct answer in the case files, say only this: I don't have enough evidence to answer that. Nothing before it, nothing after it.",
        "Never infer, speculate, or use outside knowledge.",
        "When possible, cite which case file your answer comes from.",
        "Do not narrate your search process. Never say things like 'Let me search' or 'I will look'. Go straight to the answer.",
    ],
    markdown=False,
)


@router.post("/query")
def query(req: QueryRequest, _=Depends(require_authentication)):
    if not req.question.strip():
        raise HTTPException(status_code=400, detail="Something wrong with the question")

    response: RunOutput = agent.run(req.question, stream=False)
    answer = getattr(response, "content", None) or str(response)
    return {"answer": answer}