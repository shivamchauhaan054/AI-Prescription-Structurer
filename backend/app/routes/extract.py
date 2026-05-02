from fastapi import APIRouter, HTTPException, status

from app.schemas.request import ExtractRequest
from app.schemas.response import ExtractResponse
from app.services.groq_service import GroqService, GroqServiceError, GroqTimeoutError
from app.utils.parser import MalformedLLMResponseError

from app.services.interaction_service import InteractionService

router = APIRouter(prefix="/extract", tags=["extract"])


@router.post("", response_model=ExtractResponse)
async def extract_prescription(payload: ExtractRequest) -> ExtractResponse:
    try:
        # Extract structured data using AI
        service = GroqService()
        response_data = await service.extract(payload.text)

        # Extract medication names
        med_names = [med.name for med in response_data.medications if med.name]

        # Check for drug interactions
        if med_names:
            interaction_service = InteractionService()
            interactions = await interaction_service.check_interactions(med_names)
            response_data.interactions = interactions

        return response_data
    except GroqTimeoutError as exc:
        raise HTTPException(
            status_code=status.HTTP_504_GATEWAY_TIMEOUT, detail=str(exc)
        ) from exc
    except MalformedLLMResponseError as exc:
        raise HTTPException(status_code=status.HTTP_502_BAD_GATEWAY, detail=str(exc)) from exc
    except GroqServiceError as exc:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=str(exc)) from exc
