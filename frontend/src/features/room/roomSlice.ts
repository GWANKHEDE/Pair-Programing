import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';

interface RoomState {
    roomId: string | null;
    isConnected: boolean;
    usersCount: number;
    language: string;
}

const initialState: RoomState = {
    roomId: null,
    isConnected: false,
    usersCount: 0,
    language: 'python',
};

const roomSlice = createSlice({
    name: 'room',
    initialState,
    reducers: {
        setRoomId: (state, action: PayloadAction<string>) => {
            state.roomId = action.payload;
        },
        setConnected: (state, action: PayloadAction<boolean>) => {
            state.isConnected = action.payload;
        },
        setUsersCount: (state, action: PayloadAction<number>) => {
            state.usersCount = action.payload;
        },
        setLanguage: (state, action: PayloadAction<string>) => {
            state.language = action.payload;
        },
        resetRoom: (state) => {
            state.roomId = null;
            state.isConnected = false;
            state.usersCount = 0;
            state.language = 'python';
        },
    },
});

export const { setRoomId, setConnected, setUsersCount, setLanguage, resetRoom } = roomSlice.actions;
export default roomSlice.reducer;
