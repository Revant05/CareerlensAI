from fastapi import FastAPI, HTTPException, Header, Depends
from fastapi.middleware.cors import CORSMiddleware
from schema import UserProfile, InterviewPayload, AnalysisResponse, LiveAnalysisRequest, LiveAnalysisResponse
from agents_logic import CareerAgents, GROQ_API_KEY
from typing import Optional
import os
import uvicorn
from dotenv import load_dotenv

# Load env (root .env when running locally)
load_dotenv(dotenv_path=os.path.join(os.path.dirname(__file__), '..', '.env'))

INTERNAL_SECRET = os.getenv("INTERNAL_SECRET", "careerlens_default_67890")
HOST = os.getenv("AI_ENGINE_HOST", "0.0.0.0")
PORT = int(os.getenv("AI_ENGINE_PORT", "8001"))

async def verify_internal_auth(x_internal_secret: str = Header(...)):
    if x_internal_secret != INTERNAL_SECRET:
        raise HTTPException(status_code=403, detail="Forbidden: Internal Access Only")
    return True

app = FastAPI(
    title="CareerLensAI — Groq-Powered AI Engine",
    description="Smart interview engine with domain-specific AI, real-time analysis, and behavioral assessment.",
    version="2.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
async def health_check():
    return {
        "status": "CareerLensAI AI-Engine Online",
        "version": "2.0.0",
        "groq_connected": bool(GROQ_API_KEY),
        "model": "llama-3.3-70b-versatile / llama-3.1-8b-instant"
    }

@app.get("/next-question")
async def get_question(
    domain: str,
    history: Optional[str] = "",
    _ = Depends(verify_internal_auth)
):
    """Generate the next interview question for a given domain and conversation history."""
    history_list = [h for h in history.split("|||") if h.strip()] if history else []
    question = await CareerAgents.get_interviewer_question(domain, history_list)
    return {"question": question}

@app.post("/analyze-session", response_model=AnalysisResponse)
async def analyze_session(
    payload: InterviewPayload,
    _ = Depends(verify_internal_auth)
):
    """Deep analysis of completed interview session using Groq LLM."""
    try:
        transcript_dicts = [{"role": m.role, "content": m.content} for m in payload.transcript]

        analysis = await CareerAgents.run_deep_analysis(transcript_dicts, payload.domain)
        support_msg = await CareerAgents.get_support_advise(analysis["emotional_status"])

        next_step = (
            "Advanced Projects & Certifications" if analysis["technical_score"] > 85
            else "Targeted Practice & Mock Interviews" if analysis["technical_score"] > 65
            else "Fundamental Mastery — Focus on Core Concepts"
        )

        return AnalysisResponse(
            technical_score=analysis["technical_score"],
            soft_skills_score=analysis["soft_skills_score"],
            strengths=analysis["strengths"],
            weaknesses=analysis["weaknesses"],
            emotional_feedback=support_msg,
            next_roadmap_step=next_step,
            metrics={
                **analysis,
                "behavioral_score": analysis.get("behavioral_score", analysis["soft_skills_score"]),
                "communication_clarity": analysis.get("communication_clarity", analysis["soft_skills_score"]),
                "key_topics_covered": analysis.get("key_topics_covered", [])
            }
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/live-analysis", response_model=LiveAnalysisResponse)
async def live_analysis(
    payload: LiveAnalysisRequest,
    _ = Depends(verify_internal_auth)
):
    """Real-time analysis of partial transcript for live interview metrics."""
    try:
        transcript_dicts = [{"role": m.role, "content": m.content} for m in payload.transcript]
        result = await CareerAgents.get_live_analysis(transcript_dicts, payload.domain)
        return LiveAnalysisResponse(**result)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    uvicorn.run(app, host=HOST, port=PORT)
