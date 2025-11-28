from pydantic import BaseModel
from datetime import datetime
from typing import Optional


class RoomCreate(BaseModel):
    """Schema for creating a new room."""
    language: Optional[str] = "python"


class RoomResponse(BaseModel):
    """Schema for room response."""
    room_id: str
    code_content: str
    language: str
    created_at: datetime
    
    class Config:
        from_attributes = True
