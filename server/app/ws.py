from fastapi import WebSocket

active_connections = set()

async def connect(websocket: WebSocket):
    await websocket.accept()
    active_connections.add(websocket)

def disconnect(websocket: WebSocket):
    active_connections.remove(websocket)

async def broadcast(message: dict):
    for ws in active_connections:
        await ws.send_json(message)
