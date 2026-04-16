from fastapi import FastAPI, HTTPException, Header, Depends
from fastapi.middleware.cors import CORSMiddleware
from schema import UserProfile, InterviewPayload, AnalysisResponse, LiveAnalysisRequest, LiveAnalysisResponse, ValidationRequest, ValidationResponse, RoadmapRequest, RoadmapResponse
from agents_logic import CareerAgents, GROQ_API_KEY
from typing import Optional
import os
import uvicorn
import base64
import asyncio
from dotenv import load_dotenv
import edge_tts

# Load env (root .env when running locally)
load_dotenv(dotenv_path=os.path.join(os.path.dirname(__file__), '..', '.env'))

INTERNAL_SECRET = os.getenv("INTERNAL_SECRET", "careerlens_default_67890")
HOST = os.getenv("AI_ENGINE_HOST", "0.0.0.0")
PORT = int(os.getenv("AI_ENGINE_PORT", "8001"))

async def verify_internal_auth(x_internal_secret: str = Header(...)):
    if x_internal_secret != INTERNAL_SECRET:
        raise HTTPException(status_code=403, detail="Forbidden: Internal Access Only")
    return True

async def _do_tts(text: str, voice: str):
    communicate = edge_tts.Communicate(text, voice, rate="+5%")
    audio_data = bytearray()
    async for chunk in communicate.stream():
        if chunk["type"] == "audio":
            audio_data.extend(chunk["data"])
    return base64.b64encode(audio_data).decode('utf-8')

async def generate_audio_base64(text: str, voice: str = "en-IN-NeerjaNeural"):
    """Generate TTS audio with a hard 2s timeout. Returns None if too slow, letting browser TTS handle it."""
    try:
        return await asyncio.wait_for(_do_tts(text, voice), timeout=2.0)
    except asyncio.TimeoutError:
        print("[TTS] Skipped — took too long, browser TTS will handle it")
        return None
    except Exception as e:
        print(f"[TTS Error]: {e}")
        return None

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
    
    # Generate human-like Indian voice TTS
    audio_b64 = await generate_audio_base64(question)
    
    return {
        "question": question,
        "audioBase64": audio_b64
    }

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

@app.post("/validate-profile", response_model=ValidationResponse)
async def validate_profile(
    payload: ValidationRequest,
    _ = Depends(verify_internal_auth)
):
    """Validate user profile input text for gibberish."""
    try:
        result = await CareerAgents.validate_input(payload.text, payload.field_name)
        # Using dict unpacking or direct if dict
        return ValidationResponse(**result) if isinstance(result, dict) else result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/generate-roadmap", response_model=RoadmapResponse)
async def generate_roadmap(
    payload: RoadmapRequest,
    _ = Depends(verify_internal_auth)
):
    """Generate dynamic roadmap based on multi-aspirations."""
    try:
        result = await CareerAgents.generate_dynamic_roadmap(payload.aspirations)
        return RoadmapResponse(**result) if isinstance(result, dict) else result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    uvicorn.run(app, host=HOST, port=PORT)
