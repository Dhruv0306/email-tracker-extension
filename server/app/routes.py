from fastapi import APIRouter, Request, Response, Depends
from sqlalchemy.orm import Session
from sqlalchemy import func
from .database import get_db
from .models import EmailOpen
from .schemas import EmailSummary
from .ws import broadcast
import base64
import asyncio

router = APIRouter(prefix="/api")

PIXEL = base64.b64decode(
    "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR4nGNgYAAAAAMAASsJTYQAAAAASUVORK5CYII="
)


@router.get("/pixel/{email_id}/{recipient}")
async def track_pixel(
    email_id: str, recipient: str, request: Request, db: Session = Depends(get_db)
):

    event = EmailOpen(
        email_id=email_id,
        recipient=recipient,
        ip=request.client.host if request.client else "unknown",
        user_agent=request.headers.get("user-agent"),
    )

    db.add(event)
    db.commit()
    db.close()

    print(f"Email opened: {email_id} for {recipient}")

    asyncio.create_task(
        broadcast(
            {"type": "email_opened", "email_id": email_id, "recipient": recipient}
        )
    )

    return Response(content=PIXEL, media_type="image/png")


@router.get("/emails/", response_model=list[EmailSummary])
def list_emails(db: Session = Depends(get_db)):
    results = (
        db.query(
            EmailOpen.email_id,
            func.count(EmailOpen.id).label("total_opens"),
        )
        .group_by(EmailOpen.email_id)
        .order_by(func.count(EmailOpen.id).desc())
        .all()
    )

    return results


