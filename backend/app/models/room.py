from sqlalchemy import Column, String, Text, DateTime
from sqlalchemy.sql import func
from app.database import Base


class Room(Base):
    """Room model for storing collaborative coding sessions."""
    
    __tablename__ = "rooms"
    
    room_id = Column(String(36), primary_key=True, index=True)
    code_content = Column(Text, default="", nullable=False)
    language = Column(String(50), default="python", nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())
    
    def __repr__(self):
        return f"<Room(room_id={self.room_id}, language={self.language})>"
