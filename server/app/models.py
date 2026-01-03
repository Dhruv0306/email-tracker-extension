from sqlalchemy import Column, Integer, String, DateTime
from datetime import datetime
from .database import Base

class EmailOpen(Base):
    __tablename__ = "email_opens"

    id = Column(Integer, primary_key=True, index=True)
    email_id = Column(String, index=True)
    recipient = Column(String, index=True)
    opened_at = Column(DateTime, default=datetime.utcnow)
    ip = Column(String)
    user_agent = Column(String)
