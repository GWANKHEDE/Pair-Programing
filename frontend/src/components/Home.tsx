import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createRoom } from '../features/room/roomAPI';
import './Home.css';

function Home() {
    const [roomId, setRoomId] = useState('');
    const [language, setLanguage] = useState('python');
    const [isCreating, setIsCreating] = useState(false);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleCreateRoom = async () => {
        setIsCreating(true);
        setError('');
        try {
            const response = await createRoom(language);
            navigate(`/room/${response.room_id}`);
        } catch (err) {
            setError('Failed to create room. Please try again.');
            console.error(err);
        } finally {
            setIsCreating(false);
        }
    };

    const handleJoinRoom = () => {
        if (roomId.trim()) {
            navigate(`/room/${roomId.trim()}`);
        }
    };

    return (
        <div className="home-container">
            <div className="home-content">
                <h1 className="home-title">Pair Programming</h1>
                <p className="home-subtitle">Real-time collaborative code editor</p>

                <div className="home-section">
                    <h2>Create New Room</h2>
                    <div className="create-room-form">
                        <select
                            value={language}
                            onChange={(e) => setLanguage(e.target.value)}
                            className="language-select"
                        >
                            <option value="python">Python</option>
                            <option value="javascript">JavaScript</option>
                            <option value="typescript">TypeScript</option>
                        </select>
                        <button
                            onClick={handleCreateRoom}
                            disabled={isCreating}
                            className="btn btn-primary"
                        >
                            {isCreating ? 'Creating...' : 'Create Room'}
                        </button>
                    </div>
                </div>

                <div className="divider">OR</div>

                <div className="home-section">
                    <h2>Join Existing Room</h2>
                    <div className="join-room-form">
                        <input
                            type="text"
                            placeholder="Enter room ID"
                            value={roomId}
                            onChange={(e) => setRoomId(e.target.value)}
                            onKeyPress={(e) => e.key === 'Enter' && handleJoinRoom()}
                            className="room-input"
                        />
                        <button
                            onClick={handleJoinRoom}
                            disabled={!roomId.trim()}
                            className="btn btn-secondary"
                        >
                            Join Room
                        </button>
                    </div>
                </div>

                {error && <div className="error-message">{error}</div>}
            </div>
        </div>
    );
}

export default Home;
