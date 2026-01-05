from fastapi import FastAPI
from fastapi import WebSocket
from fastapi.staticfiles import StaticFiles
from fastapi import Request
from contextlib import asynccontextmanager
from .database import engine, Base
from .routes import router
from .ws import connect, disconnect, broadcast, close_all_connections
from .ui import templates

Base.metadata.create_all(bind=engine)


@asynccontextmanager
async def lifespan(app: FastAPI):
    print("Starting up server...")
    yield
    print("Shutting down server, notifying clients...")
    await broadcast({"type": "server_shutdown", "message": "Server is shutting down."})
    await close_all_connections()


app = FastAPI(title="Email Tracker Phase 1", lifespan=lifespan)

app.include_router(router)
app.mount("/static", StaticFiles(directory="app/static"), name="static")


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
            if data == '{"type":"ping"}':
                await websocket.send_text('{"type":"pong"}')
    except:
        disconnect(websocket)
        client_id = id(websocket)
        print(f"Client disconnected: {client_id}")
