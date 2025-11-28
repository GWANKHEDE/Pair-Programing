# Frontend - Pair Programming Client

React + TypeScript + Redux frontend for real-time collaborative coding.

## Setup

1. Install dependencies:
```bash
npm install
```

2. Configure API endpoints in `.env`:
```
VITE_API_URL=http://localhost:8000
VITE_WS_URL=ws://localhost:8000
```

3. Start development server:
```bash
npm run dev
```

Application will start at `http://localhost:5173`

## Build for Production

```bash
npm run build
```

## Features

- Create and join coding rooms
- Real-time collaborative editing
- WebSocket-based synchronization
- Autocomplete suggestions (600ms debounce)
- User presence indicators
- Modern dark theme UI
