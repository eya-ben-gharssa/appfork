from fastapi import APIRouter
from app.services.mood_service import get_mood_response
from pydantic import BaseModel

router = APIRouter()

class MoodRequest(BaseModel):
    feeling: str

@router.post("/mood")
async def mood_chat(request: MoodRequest):
    # Get the full response which should now include both the response text and context
    result = get_mood_response(request.feeling)
    
    # Assuming get_bot_response now returns a dictionary with 'response' and 'context' keys
    if isinstance(result, dict):
        return {
            "feeling": request.feeling, 
            "response": result.get("response", ""),
            "context": result.get("context", ""),
            # Optionally include other information if available
            "source_documents": result.get("source_documents", [])
        }
    else:
        # Fallback for backward compatibility if get_bot_response still returns just a string
        return {
            "feeling": request.feeling,
            "response": result,
            "context": "Context retrieval not available"
        }
