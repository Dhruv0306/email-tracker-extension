from fastapi import APIRouter, Request, Response
from sqlalchemy.orm import Session
from .database import SessionLocal
from .models import EmailOpen
import base64

router = APIRouter()

PIXEL = base64.b64decode(
    "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR4nGNgYAAAAAMAASsJTYQAAAAASUVORK5CYII="
)

@router.get("/pixel/{email_id}/{recipient}")
def track_pixel(email_id: str, recipient: str, request: Request):
    db: Session = SessionLocal()

    event = EmailOpen(
        email_id=email_id,
        recipient=recipient,
        ip=request.client.host if request.client else "unknown",
        user_agent=request.headers.get("user-agent")
    )

    db.add(event)
    db.commit()
    db.close()

    return Response(content=PIXEL, media_type="image/png")
