from pydantic import BaseModel
from typing import Optional


class AutocompleteRequest(BaseModel):
    """Schema for autocomplete request."""
    code: str
    cursor_position: int
    language: str = "python"


class AutocompleteResponse(BaseModel):
    """Schema for autocomplete response."""
    suggestion: str
    confidence: float
