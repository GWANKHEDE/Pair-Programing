from fastapi import APIRouter, Depends, HTTPException, WebSocket
from sqlalchemy.orm import Session
from app.database import get_db
from app.schemas.room import RoomCreate, RoomResponse
from app.services.room_service import RoomService
from app.websocket.room_handler import handle_websocket

router = APIRouter(prefix="/rooms", tags=["rooms"])


@router.post("/", response_model=RoomResponse, status_code=201)
async def create_room(
    room_data: RoomCreate = RoomCreate(),
    db: Session = Depends(get_db)
):
    """
    Create a new collaborative coding room.
    
    Returns a unique room ID that can be used to join the room.
    """
    room = RoomService.create_room(db, language=room_data.language)
    return room


@router.get("/{room_id}", response_model=RoomResponse)
async def get_room(room_id: str, db: Session = Depends(get_db)):
    """
    Get room details by ID.
    """
    room = RoomService.get_room(db, room_id)
    if not room:
        raise HTTPException(status_code=404, detail="Room not found")
    return room


@router.websocket("/ws/{room_id}")
async def websocket_endpoint(
    websocket: WebSocket,
    room_id: str,
    db: Session = Depends(get_db)
):
    """
    WebSocket endpoint for real-time code collaboration.
    """
    await handle_websocket(websocket, room_id, db)
