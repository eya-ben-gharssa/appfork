# Agent-m7ar7er

Dholi is an AI-powered assistant designed to support mental health and emotional well-being by offering personalized recommendations based on the user's current mood. Developed as part of the Agent-m7ar7er project during a 3-day hackathon, Dholi uses a RAG (Retrieval-Augmented Generation) system to deliver accurate and empathetic responses.
<br>

﻿![Agent-m7ar7er Web App](assets/mood-camponion.png)
<br><br>

## 🧠 Features

- 🟢 Mood detection from user input  
- 🧩 Personalized suggestions based on emotions  
- 💡 RAG-based recommendation engine  
- 🎨 Clean and interactive frontend  
- 🔗 Smooth frontend-backend integration

## 🚀 Tech Stack

- **Frontend**: Next js, TypeScript
- **Backend**: Fast api, Chromedb
- **AI Tools**: Ollama, Mistral-7B-Instruct-v0.1, LangChain, RAG, HuggingFace

## 📦 Installation

### 1. Clone the repository

```bash
git clone https://github.com/lourimi-ayoub/Agent-m7ar7er.git
cd Agent-m7ar7er
```

### 2. Backend setup
```bash
cd mood-componion_rag
pip install -r requirements.txt
uvicorn main:app --reload
```

### 3. Frontend setup
```bash
cd ../frontend
npm install
npm run dev
```
