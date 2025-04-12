from fastapi import APIRouter, HTTPException, Form
from app.services.mood_service import get_mood_response
from pydantic import BaseModel
from transformers import pipeline
import requests
import base64
import time


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

mood_request_cache = {}


@router.post("/mood")
async def mood_chat(request: MoodRequest):
    # Store this request in the cache with a timestamp
    request_id = str(time.time())
    mood_request_cache[request_id] = request.feeling
    
    # Keep cache size manageable (optional)
    if len(mood_request_cache) > 100:
        oldest_key = min(mood_request_cache.keys())
        del mood_request_cache[oldest_key]
    

    # Get the full response which should now include both the response text and context
    result = get_mood_response(request.feeling)
    
    # Assuming get_bot_response now returns a dictionary with 'response' and 'context' keys
    if isinstance(result, dict):
        return {
            "feeling": request.feeling, 
            "response": result.get("response", ""),
            "context": result.get("context", ""),
            # Optionally include other information if available
            "source_documents": result.get("source_documents", []),
            "request_id": request_id  # Add this line to include the ID
        }
    else:
        # Fallback for backward compatibility if get_bot_response still returns just a string
        return {
            "feeling": request.feeling,
            "response": result.get("response", ""),
            "context": result.get("context", ""),
            "source_documents": result.get("source_documents", []),
            "request_id": request_id  # Add this line to include the ID
        }

@router.post("/analyze-sentiment", response_model=SentimentResponse)
async def analyze_sentiment(request: SentimentRequest = None, request_id: str = None):
    try:
        text_to_analyze = ""
        
        # If a request_id is provided, use the text from that mood request
        if request_id and request_id in mood_request_cache:
            text_to_analyze = mood_request_cache[request_id]
        # If no request_id but a direct request is provided, use that text
        #elif request and request.text:
         #   text_to_analyze = request.text
        # If no valid text is found
        else:
            # If no request_id specified but there are cached requests, use the most recent
            if mood_request_cache:
                latest_request_id = max(mood_request_cache.keys())
                text_to_analyze = mood_request_cache[latest_request_id]
            else:
                raise HTTPException(status_code=400, detail="No text to analyze. Provide a request_id or text.")
        
        # Get sentiment prediction
        result = sentiment_analyzer(text_to_analyze)

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
            text=text_to_analyze,
            sentiment=sentiment_readable,
            confidence=confidence
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error processing sentiment: {str(e)}")


API_URL = "https://router.huggingface.co/hf-inference/models/black-forest-labs/FLUX.1-dev"
headers = {"Authorization": "Bearer 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"}

@router.post("/generate-image")
async def generate_image(prompt: str = Form(...)):
    response = requests.post(
        API_URL,
        headers=headers,
        json={"inputs": prompt}
    )

    if response.status_code == 200:
        image_bytes = response.content
        encoded = base64.b64encode(image_bytes).decode("utf-8")
        return JSONResponse(content={"image": f"data:image/png;base64,{encoded}"})
    else:
        return JSONResponse(
            content={"error": response.text},
            status_code=response.status_code,
        )
