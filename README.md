# Real-Time Pair Programming Application

A simplified real-time pair-programming web application built with **FastAPI** (backend) and **React + TypeScript + Redux** (frontend). Two users can join the same room, edit code collaboratively, and see each other's changes instantly. The application includes a mocked AI-style autocomplete feature.

## 🌟 Features

- **Room Creation & Joining**: Create unique rooms or join existing ones via room ID
- **Real-Time Collaboration**: Multiple users can edit code simultaneously with instant synchronization
- **WebSocket Communication**: Bidirectional real-time updates using WebSockets
- **Mocked AI Autocomplete**: Rule-based code suggestions triggered after 600ms of inactivity
- **Multiple Language Support**: Python, JavaScript, TypeScript
- **User Presence**: See how many users are currently in the room
- **Modern UI**: Clean, VS Code-inspired dark theme

## 📁 Project Structure

```
Tredence/
├── backend/
│   ├── app/
│   │   ├── models/          # SQLAlchemy database models
│   │   ├── schemas/         # Pydantic request/response schemas
│   │   ├── routers/         # API route handlers
│   │   ├── services/        # Business logic layer
│   │   ├── websocket/       # WebSocket connection management
│   │   ├── config.py        # Configuration management
│   │   ├── database.py      # Database connection
│   │   └── main.py          # FastAPI application entry point
│   ├── .env                 # Environment variables
│   └── requirements.txt     # Python dependencies
│
└── frontend/
    ├── src/
    │   ├── app/             # Redux store configuration
    │   ├── features/        # Redux slices (room, editor)
    │   ├── components/      # React components
    │   ├── hooks/           # Custom React hooks (WebSocket)
    │   ├── App.tsx          # Main application component
    │   └── main.tsx         # React entry point
    ├── .env                 # Environment variables
    └── package.json         # Node dependencies
```

## 🛠️ Tech Stack

### Backend
- **FastAPI**: Modern Python web framework
- **PostgreSQL**: Database for persistent storage
- **SQLAlchemy**: ORM for database operations
- **WebSockets**: Real-time bidirectional communication
- **Pydantic**: Data validation and settings management

### Frontend
- **React 18**: UI library
- **TypeScript**: Type-safe JavaScript
- **Redux Toolkit**: State management
- **React Router**: Client-side routing
- **Vite**: Build tool and dev server

## 🚀 Setup Instructions

### Prerequisites
- Python 3.8+
- Node.js 16+
- PostgreSQL 12+

### Database Setup

1. Install PostgreSQL and create the database:
```sql
CREATE DATABASE PairPrograming;
```

2. Update the `.env` file in the `backend/` folder if needed (default credentials provided):
```env
DATABASE_URL=postgresql://postgres:root@localhost:5432/PairPrograming
```

### Backend Setup

1. Navigate to the backend directory:
```bash
cd backend
```

2. Create a virtual environment and activate it:
```bash
python -m venv venv
# Windows
venv\Scripts\activate
# macOS/Linux
source venv/bin/activate
```

3. Install dependencies:
```bash
pip install -r requirements.txt
```

4. Run the FastAPI server:
```bash
uvicorn app.main:app --reload
```

The backend will be available at `http://localhost:8000`

### Frontend Setup

1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

The frontend will be available at `http://localhost:5173`

## 📖 How to Use

1. **Start the Backend**: Run the FastAPI server on port 8000
2. **Start the Frontend**: Run the React dev server on port 5173
3. **Create a Room**: Open `http://localhost:5173` and click "Create Room"
4. **Join a Room**: Copy the room ID and share it, or paste it in "Join Existing Room"
5. **Collaborate**: Start coding! Changes will sync in real-time across all connected users
6. **Autocomplete**: Stop typing for 600ms to see AI suggestions

## 🏗️ Architecture & Design Choices

### Backend Architecture

The backend follows a **clean layered architecture**:

- **Routers**: Handle HTTP requests and WebSocket connections
- **Services**: Contain business logic (room management, autocomplete)
- **Models**: SQLAlchemy ORM models for database tables
- **Schemas**: Pydantic models for request/response validation
- **WebSocket Layer**: Connection manager handles multiple concurrent connections

**Design Decisions**:
- Used **in-memory + database hybrid**: Room state persists in PostgreSQL, but WebSocket connections are managed in-memory
- **Last-write wins**: Simple conflict resolution for concurrent edits
- **Connection pooling**: Configured for production-ready database connections
- **CORS enabled**: Allows frontend to communicate with backend

### Frontend Architecture

The frontend uses **React + Redux Toolkit** with a feature-based structure:

- **Redux Slices**: Separate slices for room state and editor state
- **Custom Hooks**: `useWebSocket` encapsulates WebSocket logic with auto-reconnection
- **Component Separation**: Home (landing page) and CodeEditor (collaborative editor)
- **Debounced Autocomplete**: 600ms timeout prevents excessive API calls

**Design Decisions**:
- **Redux for state management**: Ensures predictable state updates across components
- **WebSocket auto-reconnection**: Handles network interruptions gracefully
- **Optimistic UI updates**: Local changes render immediately before server confirmation
- **TypeScript**: Provides type safety and better developer experience

### WebSocket Protocol

Messages follow a simple JSON protocol:

**Client → Server**:
```json
{
  "type": "code_update",
  "code": "print('hello')",
  "timestamp": 1234567890
}
```

**Server → Client**:
```json
{
  "type": "code_update",
  "code": "print('hello')",
  "timestamp": 1234567890
}
```

Other message types: `init`, `user_joined`, `user_left`, `cursor_position`

## 🔮 Future Improvements

With more time, I would implement:

1. **Operational Transformation (OT) or CRDT**: Replace last-write-wins with proper conflict resolution
2. **Real AI Autocomplete**: Integrate with OpenAI Codex or GitHub Copilot
3. **Cursor Sharing**: Show where other users are typing
4. **Syntax Highlighting**: Integrate Monaco Editor or CodeMirror
5. **Authentication**: Add user accounts and room ownership
6. **Room Expiration**: Automatically delete inactive rooms
7. **Chat Feature**: Allow users to communicate within rooms
8. **Code Execution**: Run code snippets in a sandboxed environment
9. **Version History**: Track and restore previous versions
10. **Database Migrations**: Implement Alembic migrations properly
11. **Unit Tests**: Add comprehensive test coverage
12. **Docker Deployment**: Containerize both services
13. **Rate Limiting**: Prevent WebSocket/API abuse
14. **Metrics & Logging**: Add observability with structured logging

## ⚠️ Current Limitations

1. **No Conflict Resolution**: Uses last-write-wins, so rapid concurrent edits may overwrite each other
2. **No Persistence of Connections**: Refreshing the page loses connection state
3. **No Authentication**: Rooms are public and anyone with the ID can join
4. **Mock Autocomplete**: Uses static rules instead of real AI
5. **No Database Migrations**: Schema changes require manual database updates
6. **Limited Error Handling**: Some edge cases may not be handled gracefully
7. **No Room Expiration**: Rooms persist indefinitely in the database
8. **Single Server**: No horizontal scaling support

## 🧪 Testing

### Backend Testing

Test the REST API:
```bash
# Create a room
curl -X POST http://localhost:8000/rooms/ -H "Content-Type: application/json" -d '{"language": "python"}'

# Get autocomplete
curl -X POST http://localhost:8000/autocomplete/ -H "Content-Type: application/json" -d '{"code": "def ", "cursor_position": 4, "language": "python"}'
```

### Frontend Testing

1. Open two browser windows/tabs
2. Create a room in one window
3. Copy the room ID and join from the second window
4. Type in one window and verify it appears in the other

## 📝 API Documentation

Once the backend is running, visit:
- **Interactive API Docs**: http://localhost:8000/docs
- **ReDoc**: http://localhost:8000/redoc

