from datetime import datetime
from pydantic import BaseModel


class EmailOpenEvent(BaseModel):
    recipient: str
    opened_at: datetime
    ip: str | None = None
    user_agent: str | None = None

    class Config:
        from_attributes = True


class EmailSummary(BaseModel):
    email_id: str
    total_opens: int


class EmailRecipientStats(BaseModel):
    recipient: str
    open_count: int
