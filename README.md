# AI Prescription Text Structurer

Full-stack app to convert raw prescription/doctor notes into structured JSON using FastAPI + Groq + Next.js.

## Tech Stack

- **Frontend:** Next.js (App Router), TypeScript, Tailwind CSS, Axios
- **Backend:** FastAPI, Pydantic, Groq API, Uvicorn

## Project Structure

```text
AI Prescription Text Structurer/
  backend/
    app/
      main.py
      routes/
        extract.py
      services/
        groq_service.py
      schemas/
        request.py
        response.py
      utils/
        parser.py
        constants.py
    requirements.txt
    .env
  frontend/
    app/
      components/
        PrescriptionInput.tsx
        ExtractedResults.tsx
        LoadingSpinner.tsx
      lib/
        api.ts
      types/
        prescription.ts
      page.tsx
```

## Backend Setup

1. Open terminal in `backend`.
2. Install dependencies:
   ```bash
   python -m pip install -r requirements.txt
   ```
3. Create a `.env` file and set:
   ```env
   GROQ_API_KEY=your_api_key_here
   ```
4. Run server:
   ```bash
   python -m uvicorn app.main:app --reload
   ```

API runs at `http://127.0.0.1:8000`.

## Frontend Setup

1. Open terminal in `frontend`.
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create `.env.local` from `.env.local.example`:
   ```env
   NEXT_PUBLIC_API_BASE_URL=http://127.0.0.1:8000
   ```
4. Run:
   ```bash
   npm run dev
   ```

Frontend runs at `http://localhost:3000`.

## API Endpoint

### `POST /extract`

Request body:

```json
{
  "text": "raw prescription text"
}
```

Response schema:

```json
{
  "chief_complaints": [],
  "diagnosis": [],
  "medications": [
    {
      "name": "",
      "dosage": "",
      "frequency": "",
      "duration": "",
      "confidence_score": 0.0,
      "evidence": ""
    }
  ],
  "lab_tests": [],
  "radiology_tests": [],
  "advice": []
}
```

Behavior rules implemented:

- Returns only JSON from model output (code-fence cleanup + JSON extraction).
- Missing sections default to `[]`.
- Missing values are allowed as `null`.
- Confidence score normalized to `0.0` to `1.0`.
- Handles request validation, Groq timeouts, malformed response errors, and API failures.

## Prompt Design Notes

The backend sends a strict extraction prompt to Groq that enforces:

- exact schema
- JSON-only output
- no hallucination or guessing
- shorthand expansion (`OD`, `BD`, `TDS`, `QID`, `SOS`, `HS`)
- separate `lab_tests` and `radiology_tests`

Shorthand is also expanded pre-prompt in backend parser utilities for better extraction consistency.

## Sample Input

```text
Patient complains of fever since 3 days, cough and weakness.
Dx: Viral Fever
Tab Paracetamol 650 mg BD x 5 days
Syrup Cough Relief 10ml TDS
CBC test
Chest X-ray
Drink plenty of water and rest.
```

## API Testing Examples

### PowerShell (Windows)

```powershell
$body = @{
  text = "Patient complains of fever since 3 days, cough and weakness. Dx: Viral Fever Tab Paracetamol 650 mg BD x 5 days CBC test Chest X-ray Drink plenty of water and rest."
} | ConvertTo-Json

Invoke-RestMethod -Uri "http://127.0.0.1:8000/extract" -Method Post -Body $body -ContentType "application/json"
```

### cURL

```bash
curl -X POST http://127.0.0.1:8000/extract \
  -H "Content-Type: application/json" \
  -d "{\"text\":\"Tab Paracetamol 650 mg BD x 5 days\"}"
```

## Architecture Flow

1. User enters raw text in frontend textarea.
2. Frontend posts text to FastAPI `/extract`.
3. Backend calls Groq with strict prompt and expanded shorthand.
4. Backend parses and validates Groq JSON via Pydantic response schema.
5. Frontend renders clean cards and a JSON preview page for review.
