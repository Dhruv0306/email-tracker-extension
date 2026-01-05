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


async def close_all_connections():
    for ws in active_connections.copy():
        try:
            client_id = id(ws)
            await ws.close()
            print(f"Closed connection for client: {client_id}")
        except:
            pass
    active_connections.clear()
