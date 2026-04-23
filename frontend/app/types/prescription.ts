export type Medication = {
  name: string | null;
  dosage: string | null;
  frequency: string | null;
  duration: string | null;
  confidence_score: number | null;
  evidence: string | null;
};

export type ExtractResponse = {
  chief_complaints: string[];
  diagnosis: string[];
  medications: Medication[];
  lab_tests: string[];
  radiology_tests: string[];
  advice: string[];
};

export type ExtractRequest = {
  text: string;
};
