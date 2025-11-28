import { useAppDispatch } from '../app/hooks';
import { setAutocompleteSuggestion } from '../features/editor/editorSlice';
import './AutocompleteHint.css';

interface AutocompleteHintProps {
    suggestion: string;
}

function AutocompleteHint({ suggestion }: AutocompleteHintProps) {
    const dispatch = useAppDispatch();

    const handleDismiss = () => {
        dispatch(setAutocompleteSuggestion(null));
    };

    return (
        <div className="autocomplete-hint">
            <div className="hint-header">
                <span className="hint-title">✨ AI Suggestion</span>
                <button onClick={handleDismiss} className="hint-dismiss">×</button>
            </div>
            <pre className="hint-content">{suggestion}</pre>
        </div>
    );
}

export default AutocompleteHint;
