from pydantic import BaseModel
from typing import List, Optional, Dict, Any

class UserProfile(BaseModel):
    user_id: str
    skills: Optional[List[str]] = []
    aspiration: Optional[str] = ""

class TranscriptMessage(BaseModel):
    role: str
    content: str

class InterviewPayload(BaseModel):
    user_id: Optional[str] = ""
    domain: str
    transcript: List[TranscriptMessage]

class AnalysisResponse(BaseModel):
    technical_score: int
    soft_skills_score: int
    strengths: List[str]
    weaknesses: List[str]
    emotional_feedback: str
    next_roadmap_step: str
    metrics: Optional[Dict[str, Any]] = {}

class LiveAnalysisRequest(BaseModel):
    domain: str
    transcript: List[TranscriptMessage]

class LiveAnalysisResponse(BaseModel):
    running_score: int
    sentiment: str
    topics_detected: List[str]
    pace_feedback: str
