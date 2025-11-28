from fastapi import APIRouter
from app.schemas.autocomplete import AutocompleteRequest, AutocompleteResponse
from app.services.autocomplete_service import AutocompleteService

router = APIRouter(prefix="/autocomplete", tags=["autocomplete"])


@router.post("/", response_model=AutocompleteResponse)
async def get_autocomplete(request: AutocompleteRequest):
    """
    Get mocked autocomplete suggestions based on current code.
    
    This is a simplified mock implementation. In production, this would
    integrate with an AI model or language server.
    """
    suggestion, confidence = AutocompleteService.get_suggestion(
        request.code,
        request.cursor_position,
        request.language
    )
    
    return AutocompleteResponse(
        suggestion=suggestion,
        confidence=confidence
    )
