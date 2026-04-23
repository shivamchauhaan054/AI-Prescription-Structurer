from typing import List, Optional

from pydantic import BaseModel, Field, field_validator


class Medication(BaseModel):
    name: Optional[str] = None
    dosage: Optional[str] = None
    frequency: Optional[str] = None
    duration: Optional[str] = None
    confidence_score: Optional[float] = None
    evidence: Optional[str] = None

    @field_validator("confidence_score")
    @classmethod
    def validate_confidence_score(cls, value: Optional[float]) -> Optional[float]:
        if value is None:
            return value
        return max(0.0, min(1.0, float(value)))


class ExtractResponse(BaseModel):
    chief_complaints: List[str] = Field(default_factory=list)
    diagnosis: List[str] = Field(default_factory=list)
    medications: List[Medication] = Field(default_factory=list)
    lab_tests: List[str] = Field(default_factory=list)
    radiology_tests: List[str] = Field(default_factory=list)
    advice: List[str] = Field(default_factory=list)
