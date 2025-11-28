from fastapi import WebSocket, WebSocketDisconnect
from sqlalchemy.orm import Session
import json
from app.websocket.connection_manager import manager
from app.services.room_service import RoomService


async def handle_websocket(websocket: WebSocket, room_id: str, db: Session):
    """
    Handle WebSocket connection for a room.
    
    Manages real-time code synchronization between users in the same room.
    """
    await manager.connect(websocket, room_id)
    
    room = RoomService.get_room(db, room_id)
    if not room:
        await websocket.send_text(json.dumps({
            "type": "error",
            "message": "Room not found"
        }))
        await websocket.close()
        return
    
    await manager.send_personal_message(
        json.dumps({
            "type": "init",
            "code": room.code_content,
            "language": room.language,
            "users_count": manager.get_room_connection_count(room_id)
        }),
        websocket
    )
    
    await manager.broadcast_to_room(
        {
            "type": "user_joined",
            "users_count": manager.get_room_connection_count(room_id)
        },
        room_id,
        exclude=websocket
    )
    
    try:
        while True:
            data = await websocket.receive_text()
            message = json.loads(data)
            
            message_type = message.get("type")
            
            if message_type == "code_update":
                code_content = message.get("code", "")
                RoomService.update_room_code(db, room_id, code_content)
                
                await manager.broadcast_to_room(
                    {
                        "type": "code_update",
                        "code": code_content,
                        "timestamp": message.get("timestamp")
                    },
                    room_id,
                    exclude=websocket
                )
            
            elif message_type == "cursor_position":
                await manager.broadcast_to_room(
                    {
                        "type": "cursor_position",
                        "position": message.get("position"),
                        "user_id": message.get("user_id")
                    },
                    room_id,
                    exclude=websocket
                )
    
    except WebSocketDisconnect:
        manager.disconnect(websocket, room_id)
        await manager.broadcast_to_room(
            {
                "type": "user_left",
                "users_count": manager.get_room_connection_count(room_id)
            },
            room_id
        )
    except Exception as e:
        print(f"WebSocket error: {e}")
        manager.disconnect(websocket, room_id)
