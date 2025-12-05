from fastapi import FastAPI
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware
import random
import httpx
import json
import os
from datetime import datetime, timedelta

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

DATA_FILE = "history.json"


SEED_DATA = [
    {"date": (datetime.now() - timedelta(days=6)).strftime("%Y-%m-%d"), "display_date": (datetime.now() - timedelta(days=6)).strftime("%a"), "score": 5.0},
    {"date": (datetime.now() - timedelta(days=5)).strftime("%Y-%m-%d"), "display_date": (datetime.now() - timedelta(days=5)).strftime("%a"), "score": 6.5},
    {"date": (datetime.now() - timedelta(days=4)).strftime("%Y-%m-%d"), "display_date": (datetime.now() - timedelta(days=4)).strftime("%a"), "score": 4.0},
    {"date": (datetime.now() - timedelta(days=3)).strftime("%Y-%m-%d"), "display_date": (datetime.now() - timedelta(days=3)).strftime("%a"), "score": 8.5},
    {"date": (datetime.now() - timedelta(days=2)).strftime("%Y-%m-%d"), "display_date": (datetime.now() - timedelta(days=2)).strftime("%a"), "score": 7.0},
    {"date": (datetime.now() - timedelta(days=1)).strftime("%Y-%m-%d"), "display_date": "Yesterday", "score": 9.0},
    {"date": datetime.now().strftime("%Y-%m-%d"), "display_date": "Today", "score": 9.5}
]

WORDS_DB = [
    {
        "word": "Runway",
        "type": "Noun",
        "pronunciation": "[run-way]",
        "meaning": "A strip of hard ground along which aircraft take off and land.",
        "example": "The jet braked hard as its wheels touched the runway.",
        "imageUrl": "https://images.unsplash.com/photo-1436491865332-7a61a109cc05?q=80&w=2074&auto=format&fit=crop"
    },
    {
        "word": "Aurora",
        "type": "Noun",
        "pronunciation": "[uh-rawr-uh]",
        "meaning": "A natural electrical phenomenon characterized by the appearance of streamers of reddish or greenish light in the sky.",
        "example": "We stayed up all night to watch the breathtaking aurora borealis.",
        "imageUrl": "https://images.unsplash.com/photo-1531366936337-7c912a4589a7?q=80&w=2070&auto=format&fit=crop"
    },
    {
        "word": "Solitude",
        "type": "Noun",
        "pronunciation": "[sol-i-tude]",
        "meaning": "The state or situation of being alone.",
        "example": "She enjoyed the peace and solitude of the woods.",
        "imageUrl": "https://images.unsplash.com/photo-1499591934245-40b55745b905?q=80&w=2072&auto=format&fit=crop"
    }
]


@app.on_event("startup")
async def startup_event():
    
    if not os.path.exists(DATA_FILE):
        print(f"Creating new data file at: {os.path.abspath(DATA_FILE)}")
        with open(DATA_FILE, "w", encoding="utf-8") as f:
            json.dump(SEED_DATA, f, indent=4)
        print(" Seed data written successfully!")
    else:
        print(f" Found existing data file at: {os.path.abspath(DATA_FILE)}")

def load_history():
    if not os.path.exists(DATA_FILE):
        return []
    try:
        with open(DATA_FILE, "r", encoding="utf-8") as f:
            return json.load(f)
    except:
        return []

def save_history(new_record):
    history = load_history()
    history.append(new_record)
    with open(DATA_FILE, "w", encoding="utf-8") as f:
        json.dump(history, f, indent=4)

class SentenceInput(BaseModel):
    word: str
    sentence: str

@app.get("/api/word")
async def get_random_word():
    return random.choice(WORDS_DB)

@app.post("/api/validate-sentence")
async def validate_sentence(data: SentenceInput):
    n8n_url = "http://localhost:5678/webhook/c2e79391-13ab-4f23-89c5-64e2e33f99fb"

    print(f"Sending data to n8n: {data.word} -> {data.sentence}")

    try:
        async with httpx.AsyncClient() as client:
            response = await client.post(n8n_url, json={"word": data.word, "sentence": data.sentence}, timeout=30.0)
            result = response.json()
            
            now = datetime.now()
            save_history({
                "date": now.strftime("%Y-%m-%d"),
                "display_date": now.strftime("%a %H:%M"),
                "score": result.get("score", 0)
            })
            
            return result

    except Exception as e:
        print(f"Error calling n8n: {e}")
        return {"score": 0, "level": "Error", "suggestion": "Connection failed", "corrected_sentence": ""}

@app.get("/api/summary")
async def get_summary():
    history = load_history()


    unique_dates = sorted(list(set(item["date"] for item in history)), reverse=True)
    today_str = datetime.now().strftime("%Y-%m-%d")
    yesterday_str = (datetime.now() - timedelta(days=1)).strftime("%Y-%m-%d")
    
    current_streak = 0
    
    if unique_dates:
        if unique_dates[0] == today_str or unique_dates[0] == yesterday_str:
            check_date = datetime.now()
            if unique_dates[0] == today_str:
                current_streak = 1
                check_date = check_date - timedelta(days=1)
            
            while check_date.strftime("%Y-%m-%d") in unique_dates:
                current_streak += 1
                check_date = check_date - timedelta(days=1)

    total_minutes = len(history) * 5

    chart_data = []
    for item in history[-7:]:
        chart_data.append({
            "date": item.get("display_date", item["date"]),
            "score": item["score"]
        })

    return {
        "chart": chart_data,
        "stats": {
            "streak": current_streak,
            "minutes": total_minutes
        }
    }