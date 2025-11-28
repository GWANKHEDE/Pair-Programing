class AutocompleteService:
    """Service for providing mocked autocomplete suggestions."""
    
    # Mock suggestion templates based on common code patterns
    PYTHON_SUGGESTIONS = {
        "def ": "def function_name():\n    pass",
        "class ": "class ClassName:\n    def __init__(self):\n        pass",
        "for ": "for item in iterable:\n    ",
        "if ": "if condition:\n    ",
        "import ": "import module_name",
        "from ": "from module import name",
        "while ": "while condition:\n    ",
        "try": "try:\n    pass\nexcept Exception as e:\n    pass",
        "with ": "with open('file.txt') as f:\n    ",
        "print": "print()",
        "return": "return value",
    }
    
    JAVASCRIPT_SUGGESTIONS = {
        "function ": "function name() {\n    \n}",
        "const ": "const name = value;",
        "let ": "let name = value;",
        "for ": "for (let i = 0; i < length; i++) {\n    \n}",
        "if ": "if (condition) {\n    \n}",
        "import ": "import { name } from 'module';",
        "export ": "export const name = value;",
        "async ": "async function name() {\n    \n}",
        "console": "console.log()",
        "return": "return value;",
    }
    
    @staticmethod
    def get_suggestion(code: str, cursor_position: int, language: str = "python") -> tuple[str, float]:
        """
        Generate a mocked autocomplete suggestion based on current code.
        
        Args:
            code: Current code content
            cursor_position: Cursor position in the code
            language: Programming language
            
        Returns:
            Tuple of (suggestion, confidence)
        """
        # Get the last few characters before cursor
        start = max(0, cursor_position - 20)
        recent_code = code[start:cursor_position].lower()
        
        # Choose appropriate suggestions based on language
        suggestions = (
            AutocompleteService.PYTHON_SUGGESTIONS 
            if language == "python" 
            else AutocompleteService.JAVASCRIPT_SUGGESTIONS
        )
        
        # Find matching patterns
        for pattern, suggestion in suggestions.items():
            if recent_code.endswith(pattern.lower()):
                return suggestion, 0.85
        
        # Default suggestions if no pattern matches
        if language == "python":
            return "# Continue coding...", 0.3
        else:
            return "// Continue coding...", 0.3
