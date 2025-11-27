from fastapi import FastAPI
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware
import random
import httpx

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

WORDS_DB = [
    {
        "word": "Runway",
        "type": "Noun",
        "pronunciation": "[run-way]",
        "meaning": "A strip of hard ground along which aircraft take off and land.",
        "example": "The jet braked hard as its wheels touched the runway.",
        "imageUrl": "https://images.unsplash.com/photo-1559627775-60c04fa28249?q=80&w=2070&auto=format&fit=crop"
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
    },
    {
        "word": "Labyrinth",
        "type": "Noun",
        "pronunciation": "[lab-uh-rinth]",
        "meaning": "A complicated irregular network of passages or paths in which it is difficult to find one's way.",
        "example": "The old city was a labyrinth of narrow streets.",
        "imageUrl": "https://images.unsplash.com/photo-1476984251899-8d7fdfc5c92c?q=80&w=2034&auto=format&fit=crop"
    },
    {
        "word": "Horizon",
        "type": "Noun",
        "pronunciation": "[huh-rahy-zuhn]",
        "meaning": "The line at which the earth's surface and the sky appear to meet.",
        "example": "The sun sank below the horizon.",
        "imageUrl": "https://images.unsplash.com/photo-1500382017468-9049fed747ef?q=80&w=2832&auto=format&fit=crop"
    }
]

class SentenceInput(BaseModel):
    word: str
    sentence: str

@app.get("/api/word")
async def get_random_word():
    """สุ่มคำศัพท์ 1 คำ พร้อมข้อมูลครบชุดส่งกลับไป"""
    return random.choice(WORDS_DB)

@app.post("/api/validate-sentence")
async def validate_sentence(data: SentenceInput):
    n8n_url = "https://thipphawan1001.app.n8n.cloud/webhook-test/c2e79391-13ab-4f23-89c5-64e2e33f99fb" 

    print(f"Sending data to n8n: {data.word} -> {data.sentence}")

    try:
        async with httpx.AsyncClient() as client:
            response = await client.post(n8n_url, json={"word": data.word, "sentence": data.sentence}, timeout=30.0)
            
            return response.json()

    except Exception as e:
        print(f"Error calling n8n: {e}")

        return {
            "score": 0,
            "level": "Error",
            "suggestion": "Could not connect to AI. Please check backend console.",
            "corrected_sentence": "Connection failed."
            }

@app.get("/api/summary")
async def get_summary():
    return [
        {"date": "Mon", "score": 6.5},
        {"date": "Tue", "score": 7.0},
        {"date": "Wed", "score": 8.5},
        {"date": "Thu", "score": 6.0},
        {"date": "Fri", "score": 9.0},
    ]
