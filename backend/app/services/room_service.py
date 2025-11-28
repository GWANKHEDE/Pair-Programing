import uuid
from sqlalchemy.orm import Session
from app.models.room import Room
from typing import Optional


class RoomService:
    """Service for managing rooms."""
    
    @staticmethod
    def create_room(db: Session, language: str = "python") -> Room:
        """Create a new room with a unique ID."""
        room_id = str(uuid.uuid4())
        room = Room(
            room_id=room_id,
            code_content="",
            language=language
        )
        db.add(room)
        db.commit()
        db.refresh(room)
        return room
    
    @staticmethod
    def get_room(db: Session, room_id: str) -> Optional[Room]:
        """Get a room by ID."""
        return db.query(Room).filter(Room.room_id == room_id).first()
    
    @staticmethod
    def update_room_code(db: Session, room_id: str, code_content: str) -> Optional[Room]:
        """Update room code content."""
        room = db.query(Room).filter(Room.room_id == room_id).first()
        if room:
            room.code_content = code_content
            db.commit()
            db.refresh(room)
        return room
