import { useEffect, useState, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { useAppSelector, useAppDispatch } from '../app/hooks';
import { setRoomId, setLanguage } from '../features/room/roomSlice';
import { setCode, setCursorPosition, setAutocompleteSuggestion, setLoadingAutocomplete } from '../features/editor/editorSlice';
import { useWebSocket } from '../hooks/useWebSocket';
import { getAutocomplete } from '../features/room/roomAPI';
import AutocompleteHint from './AutocompleteHint';
import './CodeEditor.css';

function CodeEditor() {
    const { roomId } = useParams<{ roomId: string }>();
    const dispatch = useAppDispatch();
    const { code, cursorPosition, autocompleteSuggestion } = useAppSelector((state) => state.editor);
    const { isConnected, usersCount, language } = useAppSelector((state) => state.room);

    const textareaRef = useRef<HTMLTextAreaElement>(null);
    const autocompleteTimeout = useRef<NodeJS.Timeout>();
    const [localCode, setLocalCode] = useState(code);

    const { sendMessage } = useWebSocket({
        roomId: roomId || '',
    });

    useEffect(() => {
        if (roomId) {
            dispatch(setRoomId(roomId));
        }
    }, [roomId, dispatch]);

    useEffect(() => {
        setLocalCode(code);
    }, [code]);

    const handleCodeChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        const newCode = e.target.value;
        const newCursorPosition = e.target.selectionStart;

        setLocalCode(newCode);
        dispatch(setCode(newCode));
        dispatch(setCursorPosition(newCursorPosition));

        // Send code update via WebSocket
        sendMessage({
            type: 'code_update',
            code: newCode,
            timestamp: Date.now(),
        });

        // Clear previous autocomplete timeout
        if (autocompleteTimeout.current) {
            clearTimeout(autocompleteTimeout.current);
        }

        // Set new autocomplete timeout (600ms)
        autocompleteTimeout.current = setTimeout(async () => {
            try {
                dispatch(setLoadingAutocomplete(true));
                const response = await getAutocomplete({
                    code: newCode,
                    cursor_position: newCursorPosition,
                    language: language,
                });

                if (response.confidence > 0.5) {
                    dispatch(setAutocompleteSuggestion(response.suggestion));
                }
            } catch (error) {
                console.error('Autocomplete error:', error);
            } finally {
                dispatch(setLoadingAutocomplete(false));
            }
        }, 600);
    };

    const handleCursorChange = () => {
        if (textareaRef.current) {
            const position = textareaRef.current.selectionStart;
            dispatch(setCursorPosition(position));
        }
    };

    const copyRoomId = () => {
        if (roomId) {
            navigator.clipboard.writeText(roomId);
            alert('Room ID copied to clipboard!');
        }
    };

    return (
        <div className="editor-container">
            <div className="editor-header">
                <div className="header-left">
                    <h2>Pair Programming</h2>
                    <span className={`status-badge ${isConnected ? 'connected' : 'disconnected'}`}>
                        {isConnected ? '● Connected' : '○ Disconnected'}
                    </span>
                </div>
                <div className="header-right">
                    <span className="users-count">👥 {usersCount} user{usersCount !== 1 ? 's' : ''}</span>
                    <button onClick={copyRoomId} className="copy-btn">
                        📋 Copy Room ID
                    </button>
                </div>
            </div>

            <div className="editor-info">
                <span className="room-id">Room: {roomId}</span>
                <select
                    value={language}
                    onChange={(e) => dispatch(setLanguage(e.target.value))}
                    className="language-selector"
                >
                    <option value="python">Python</option>
                    <option value="javascript">JavaScript</option>
                    <option value="typescript">TypeScript</option>
                </select>
            </div>

            <div className="editor-wrapper">
                <textarea
                    ref={textareaRef}
                    value={localCode}
                    onChange={handleCodeChange}
                    onSelect={handleCursorChange}
                    onClick={handleCursorChange}
                    onKeyUp={handleCursorChange}
                    className="code-textarea"
                    placeholder="Start typing your code here..."
                    spellCheck={false}
                />
                {autocompleteSuggestion && (
                    <AutocompleteHint suggestion={autocompleteSuggestion} />
                )}
            </div>
        </div>
    );
}

export default CodeEditor;
