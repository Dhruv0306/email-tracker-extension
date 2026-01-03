from fastapi import FastAPI
from .database import engine, Base
from .routes import router

Base.metadata.create_all(bind=engine)

app = FastAPI(title="Email Tracker Phase 1")

app.include_router(router)

@app.get("/")
def root():
    return {"status": "Email Tracker Phase 1 running"}
