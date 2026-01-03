from fastapi import FastAPI
from fastapi import WebSocket
from .database import engine, Base
from .routes import router
from .ws import connect, disconnect, broadcast

Base.metadata.create_all(bind=engine)

app = FastAPI(title="Email Tracker Phase 1")

app.include_router(router)


@app.get("/")
def root():
    return {"status": "Email Tracker Phase 1 running"}


@app.websocket("/ws")
async def websocket_endpoint(websocket: WebSocket):
    await connect(websocket)
    client_id = id(websocket)
    print(f"Client connected: {client_id}")
    try:
        while True:
            data = await websocket.receive_text()
            if data == "{\"type\":\"ping\"}":
                await websocket.send_text("{\"type\":\"pong\"}")
    except:
        disconnect(websocket)
        client_id = id(websocket)
        print(f"Client disconnected: {client_id}")