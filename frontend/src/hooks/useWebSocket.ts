import { useEffect, useRef, useCallback } from 'react';
import { useAppDispatch } from '../app/hooks';
import { setConnected, setUsersCount } from '../features/room/roomSlice';
import { setCode } from '../features/editor/editorSlice';

const WS_URL = import.meta.env.VITE_WS_URL || 'ws://localhost:8000';

interface UseWebSocketOptions {
    roomId: string;
    onMessage?: (data: any) => void;
}

export const useWebSocket = ({ roomId, onMessage }: UseWebSocketOptions) => {
    const ws = useRef<WebSocket | null>(null);
    const dispatch = useAppDispatch();
    const reconnectTimeout = useRef<NodeJS.Timeout>();

    const connect = useCallback(() => {
        if (ws.current?.readyState === WebSocket.OPEN) {
            return;
        }

        const websocket = new WebSocket(`${WS_URL}/rooms/ws/${roomId}`);

        websocket.onopen = () => {
            console.log('WebSocket connected');
            dispatch(setConnected(true));
        };

        websocket.onmessage = (event) => {
            try {
                const data = JSON.parse(event.data);
                console.log('Received:', data);

                switch (data.type) {
                    case 'init':
                        dispatch(setCode(data.code));
                        dispatch(setUsersCount(data.users_count));
                        break;
                    case 'code_update':
                        dispatch(setCode(data.code));
                        break;
                    case 'user_joined':
                    case 'user_left':
                        dispatch(setUsersCount(data.users_count));
                        break;
                }

                if (onMessage) {
                    onMessage(data);
                }
            } catch (error) {
                console.error('Error parsing WebSocket message:', error);
            }
        };

        websocket.onerror = (error) => {
            console.error('WebSocket error:', error);
        };

        websocket.onclose = () => {
            console.log('WebSocket disconnected');
            dispatch(setConnected(false));

            // Attempt to reconnect after 3 seconds
            reconnectTimeout.current = setTimeout(() => {
                console.log('Attempting to reconnect...');
                connect();
            }, 3000);
        };

        ws.current = websocket;
    }, [roomId, dispatch, onMessage]);

    const disconnect = useCallback(() => {
        if (reconnectTimeout.current) {
            clearTimeout(reconnectTimeout.current);
        }
        if (ws.current) {
            ws.current.close();
            ws.current = null;
        }
        dispatch(setConnected(false));
    }, [dispatch]);

    const sendMessage = useCallback((message: any) => {
        if (ws.current?.readyState === WebSocket.OPEN) {
            ws.current.send(JSON.stringify(message));
        } else {
            console.error('WebSocket is not connected');
        }
    }, []);

    useEffect(() => {
        connect();
        return () => {
            disconnect();
        };
    }, [connect, disconnect]);

    return { sendMessage, disconnect, isConnected: ws.current?.readyState === WebSocket.OPEN };
};
