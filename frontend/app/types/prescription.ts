export type Medication = {
  name: string | null;
  dosage: string | null;
  frequency: string | null;
  duration: string | null;
  confidence_score: number | null;
  evidence: string | null;
};

export type PatientInfo = {
  name: string | null;
  age: string | null;
  gender: string | null;
};

export type Vitals = {
  bp: string | null;
  pulse: string | null;
  temperature: string | null;
  weight: string | null;
};

export type InteractionWarning = {
  drugs: string[];
  description: string;
  severity: string;
};

export type ExtractResponse = {
  patient_info: PatientInfo;
  vitals: Vitals;
  chief_complaints: string[];
  diagnosis: string[];
  medications: Medication[];
  interactions: InteractionWarning[];
  lab_tests: string[];
  radiology_tests: string[];
  advice: string[];
};

export type ExtractRequest = {
  text: string;
};
