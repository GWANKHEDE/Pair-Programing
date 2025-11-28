# Backend - Pair Programming API

FastAPI backend for real-time collaborative coding.

## Setup

1. Create virtual environment:
```bash
python -m venv venv
venv\Scripts\activate  # Windows
```

2. Install dependencies:
```bash
pip install -r requirements.txt
```

3. Configure database in `.env`:
```
DATABASE_URL=postgresql://postgres:root@localhost:5432/PairPrograming
```

4. Create PostgreSQL database:
```sql
CREATE DATABASE PairPrograming;
```

5. Run the server:
```bash
uvicorn app.main:app --reload
```

Server will start at `http://localhost:8000`

## API Endpoints

- `POST /rooms/` - Create a new room
- `GET /rooms/{room_id}` - Get room details
- `WS /rooms/ws/{room_id}` - WebSocket connection for real-time collaboration
- `POST /autocomplete/` - Get mocked autocomplete suggestions

## Documentation

Visit `http://localhost:8000/docs` for interactive API documentation.
