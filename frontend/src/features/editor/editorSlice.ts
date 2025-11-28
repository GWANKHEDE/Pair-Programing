import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';

interface EditorState {
    code: string;
    cursorPosition: number;
    autocompleteSuggestion: string | null;
    isLoadingAutocomplete: boolean;
}

const initialState: EditorState = {
    code: '',
    cursorPosition: 0,
    autocompleteSuggestion: null,
    isLoadingAutocomplete: false,
};

const editorSlice = createSlice({
    name: 'editor',
    initialState,
    reducers: {
        setCode: (state, action: PayloadAction<string>) => {
            state.code = action.payload;
        },
        setCursorPosition: (state, action: PayloadAction<number>) => {
            state.cursorPosition = action.payload;
        },
        setAutocompleteSuggestion: (state, action: PayloadAction<string | null>) => {
            state.autocompleteSuggestion = action.payload;
        },
        setLoadingAutocomplete: (state, action: PayloadAction<boolean>) => {
            state.isLoadingAutocomplete = action.payload;
        },
        clearAutocomplete: (state) => {
            state.autocompleteSuggestion = null;
        },
    },
});

export const {
    setCode,
    setCursorPosition,
    setAutocompleteSuggestion,
    setLoadingAutocomplete,
    clearAutocomplete,
} = editorSlice.actions;

export default editorSlice.reducer;
