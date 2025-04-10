from fastapi import FastAPI
from app.api import routes
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(title="Mood Companion")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, specify actual origins instead of "*"
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(routes.router)
