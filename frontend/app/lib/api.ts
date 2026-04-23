import axios from "axios";

import type { ExtractRequest, ExtractResponse } from "@/app/types/prescription";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://127.0.0.1:8000";

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
  headers: {
    "Content-Type": "application/json",
  },
});

export async function extractPrescription(
  payload: ExtractRequest
): Promise<ExtractResponse> {
  const response = await api.post<ExtractResponse>("/extract", payload);
  return response.data;
}
