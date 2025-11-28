from typing import Dict, List
from fastapi import WebSocket
import json


class ConnectionManager:
    """Manages WebSocket connections for rooms."""
    
    def __init__(self):
        # Dictionary mapping room_id to list of active connections
        self.active_connections: Dict[str, List[WebSocket]] = {}
    
    async def connect(self, websocket: WebSocket, room_id: str):
        """Accept and register a new WebSocket connection."""
        await websocket.accept()
        if room_id not in self.active_connections:
            self.active_connections[room_id] = []
        self.active_connections[room_id].append(websocket)
    
    def disconnect(self, websocket: WebSocket, room_id: str):
        """Remove a WebSocket connection."""
        if room_id in self.active_connections:
            if websocket in self.active_connections[room_id]:
                self.active_connections[room_id].remove(websocket)
            # Clean up empty room
            if not self.active_connections[room_id]:
                del self.active_connections[room_id]
    
    async def send_personal_message(self, message: str, websocket: WebSocket):
        """Send a message to a specific WebSocket."""
        await websocket.send_text(message)
    
    async def broadcast_to_room(self, message: dict, room_id: str, exclude: WebSocket = None):
        """
        Broadcast a message to all connections in a room.
        
        Args:
            message: Message dictionary to broadcast
            room_id: Room to broadcast to
            exclude: Optional WebSocket to exclude from broadcast (e.g., sender)
        """
        if room_id in self.active_connections:
            message_text = json.dumps(message)
            for connection in self.active_connections[room_id]:
                if connection != exclude:
                    try:
                        await connection.send_text(message_text)
                    except Exception as e:
                        print(f"Error sending message: {e}")
    
    def get_room_connection_count(self, room_id: str) -> int:
        """Get the number of active connections in a room."""
        return len(self.active_connections.get(room_id, []))


# Global connection manager instance
manager = ConnectionManager()
