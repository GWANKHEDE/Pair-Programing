const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

export interface CreateRoomResponse {
    room_id: string;
    code_content: string;
    language: string;
    created_at: string;
}

export interface AutocompleteRequest {
    code: string;
    cursor_position: number;
    language: string;
}

export interface AutocompleteResponse {
    suggestion: string;
    confidence: number;
}

export const createRoom = async (language: string = 'python'): Promise<CreateRoomResponse> => {
    const response = await fetch(`${API_URL}/rooms/`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ language }),
    });

    if (!response.ok) {
        throw new Error('Failed to create room');
    }

    return response.json();
};

export const getAutocomplete = async (request: AutocompleteRequest): Promise<AutocompleteResponse> => {
    const response = await fetch(`${API_URL}/autocomplete/`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(request),
    });

    if (!response.ok) {
        throw new Error('Failed to get autocomplete');
    }

    return response.json();
};
