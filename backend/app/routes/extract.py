from fastapi import APIRouter, HTTPException, status

from app.schemas.request import ExtractRequest
from app.schemas.response import ExtractResponse
from app.services.groq_service import GroqService, GroqServiceError, GroqTimeoutError
from app.utils.parser import MalformedLLMResponseError

router = APIRouter(prefix="/extract", tags=["extract"])


@router.post("", response_model=ExtractResponse)
async def extract_prescription(payload: ExtractRequest) -> ExtractResponse:
    try:
        service = GroqService()
        return await service.extract(payload.text)
    except GroqTimeoutError as exc:
        raise HTTPException(
            status_code=status.HTTP_504_GATEWAY_TIMEOUT, detail=str(exc)
        ) from exc
    except MalformedLLMResponseError as exc:
        raise HTTPException(status_code=status.HTTP_502_BAD_GATEWAY, detail=str(exc)) from exc
    except GroqServiceError as exc:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=str(exc)) from exc
