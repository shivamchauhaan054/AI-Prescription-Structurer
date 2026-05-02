from typing import List, Dict, Tuple
from app.schemas.response import InteractionWarning

class InteractionService:
    # A simulated local database of common dangerous drug interactions for demo purposes
    # In a real production app, this would query a paid database like First Databank or Medi-Span.
    # The NIH RxNav Interaction API was recently retired.
    COMMON_INTERACTIONS: Dict[Tuple[str, str], Dict[str, str]] = {
        ("warfarin", "aspirin"): {
            "description": "Concurrent use of Warfarin and Aspirin significantly increases the risk of severe bleeding. Aspirin inhibits platelet aggregation and can cause gastric mucosal damage, which exacerbates the bleeding risk from Warfarin's anticoagulant effect.",
            "severity": "High"
        },
        ("sildenafil", "nitroglycerin"): {
            "description": "Coadministration of sildenafil with nitrates (like nitroglycerin) can cause a severe and potentially fatal drop in blood pressure.",
            "severity": "High"
        },
        ("simvastatin", "amiodarone"): {
            "description": "Amiodarone can inhibit the metabolism of simvastatin, significantly increasing the risk of myopathy or rhabdomyolysis.",
            "severity": "High"
        },
        ("lisinopril", "spironolactone"): {
            "description": "Both medications can increase potassium levels. Taking them together increases the risk of severe hyperkalemia.",
            "severity": "Moderate"
        },
        ("ibuprofen", "lisinopril"): {
            "description": "NSAIDs like ibuprofen can reduce the antihypertensive effect of ACE inhibitors like lisinopril and increase the risk of renal impairment.",
            "severity": "Moderate"
        }
    }

    async def check_interactions(self, medication_names: List[str]) -> List[InteractionWarning]:
        """Checks for interactions between a list of medication names using a local clinical database."""
        warnings: List[InteractionWarning] = []
        
        if len(medication_names) < 2:
            return warnings

        # Normalize names to lowercase for checking
        normalized_names = [name.lower().strip() for name in medication_names if name]

        # Check all possible pairs
        for i in range(len(normalized_names)):
            for j in range(i + 1, len(normalized_names)):
                drug1 = normalized_names[i]
                drug2 = normalized_names[j]
                
                # Check for direct matches or substring matches (e.g., "Aspirin 81mg" contains "aspirin")
                for (db_drug1, db_drug2), data in self.COMMON_INTERACTIONS.items():
                    if (db_drug1 in drug1 and db_drug2 in drug2) or (db_drug1 in drug2 and db_drug2 in drug1):
                        warnings.append(
                            InteractionWarning(
                                drugs=[medication_names[i], medication_names[j]],
                                description=data["description"],
                                severity=data["severity"]
                            )
                        )

        return warnings
