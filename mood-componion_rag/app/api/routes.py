from fastapi import APIRouter, HTTPException
from app.services.mood_service import get_mood_response
from pydantic import BaseModel
from transformers import pipeline

router = APIRouter()

# Load the sentiment analysis pipeline
try:
    sentiment_analyzer = pipeline("sentiment-analysis", model="cardiffnlp/twitter-roberta-base-sentiment")
except Exception as e:
    print(f"Error loading sentiment model: {e}")
    # The router will still work but will raise exceptions when the sentiment endpoint is called

class MoodRequest(BaseModel):
    feeling: str

class SentimentRequest(BaseModel):
    text: str

class SentimentResponse(BaseModel):
    text: str
    sentiment: str
    confidence: float

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

@router.post("/analyze-sentiment", response_model=SentimentResponse)
async def analyze_sentiment(request: SentimentRequest):
    try:
        # Get sentiment prediction
        result = sentiment_analyzer(request.text)
        
        # Extract sentiment and confidence
        sentiment = result[0]['label']
        confidence = result[0]['score'] * 100  # Convert to percentage
        
        label_map = {
          "LABEL_0": "Negative",
          "LABEL_1": "Neutral",
          "LABEL_2": "Positive"
        }

        sentiment_readable = label_map.get(sentiment, sentiment)

        return SentimentResponse(
            text=request.text,
            sentiment=sentiment_readable,
            confidence=confidence
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error processing sentiment: {str(e)}")
