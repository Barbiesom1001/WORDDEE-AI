# Worddee.ai 🌍

เว็บแอปพลิเคชันฝึกแต่งประโยคภาษาอังกฤษ พร้อมระบบ AI ตรวจจับไวยากรณ์และให้คะแนนอัตโนมัติ

## Tech Stack
- **Frontend:** Next.js (React), Tailwind CSS, Axios, Lucide React
- **Backend:** FastAPI (Python), Uvicorn
- **AI/Automation:** n8n (Webhook integration)

## Features
1. **Word of the Day:** สุ่มคำศัพท์พร้อมรูปภาพและความหมายจาก Backend
2. **AI Feedback:** ส่งประโยคไปตรวจสอบความถูกต้องและรับคำแนะนำ (ผ่าน n8n)
3. **Dashboard:** แสดงสถิติการเรียนรู้ของผู้ใช้

---

## Installation & Setup

### 1. Backend (FastAPI)
```bash
cd backend

python -m venv venv
.\venv\Scripts\activate
source venv/bin/activate

pip install fastapi uvicorn pydantic httpx

python -m uvicorn main:app --reload --port 8000
