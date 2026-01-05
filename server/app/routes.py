from fastapi import APIRouter, Request, Response, Depends
from fastapi.responses import HTMLResponse
from sqlalchemy.orm import Session
from sqlalchemy import func
from .database import get_db
from .models import EmailOpen
from .schemas import EmailSummary, EmailRecipientStats, EmailOpenEvent
from .ws import broadcast
from .ui import templates
import base64
import asyncio

router = APIRouter(prefix="/api")

PIXEL = base64.b64decode(
    "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR4nGNgYAAAAAMAASsJTYQAAAAASUVORK5CYII="
)


# =========================================================================
# Email tracking routes
# =========================================================================


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
            {"type": "email_opened", "email_id": email_id, "recipient": recipient, "timestamp": event.opened_at.isoformat()}
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


@router.get("/emails/{email_id}", response_model=list[EmailRecipientStats])
def email_details(email_id: str, db: Session = Depends(get_db)):
    results = (
        db.query(
            EmailOpen.recipient,
            func.count(EmailOpen.id).label("open_count"),
        )
        .filter(EmailOpen.email_id == email_id)
        .group_by(EmailOpen.recipient)
        .all()
    )

    return results


@router.get("/emails/{email_id}/opens", response_model=list[EmailOpenEvent])
def email_open_events(email_id: str, db: Session = Depends(get_db)):
    events = (
        db.query(EmailOpen)
        .filter(EmailOpen.email_id == email_id)
        .order_by(EmailOpen.opened_at.desc())
        .all()
    )

    return events


# =========================================================================
# Dashboard routes
# =========================================================================


@router.get("/dashboard", response_class=HTMLResponse)
def dashboard(request: Request):
    return templates.TemplateResponse("dashboard.html", {"request": request})
