"use client";

import { useRef, useState } from "react";
import Tesseract from "tesseract.js";
import { ImagePlus, Loader2 } from "lucide-react";

type PrescriptionInputProps = {
  value: string;
  isLoading: boolean;
  onChange: (value: string) => void;
  onSubmit: () => void;
  onClear: () => void;
};

export default function PrescriptionInput({
  value,
  isLoading,
  onChange,
  onSubmit,
  onClear,
}: PrescriptionInputProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isOcrLoading, setIsOcrLoading] = useState(false);
  const [ocrStatus, setOcrStatus] = useState("");
  const [ocrProgress, setOcrProgress] = useState(0);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsOcrLoading(true);
    setOcrStatus("Initializing...");
    setOcrProgress(0);

    try {
      const result = await Tesseract.recognize(
        file,
        "eng+hin",
        {
          logger: (m) => {
            if (m.status === "recognizing text") {
              setOcrStatus("Extracting text from image...");
              setOcrProgress(Math.round(m.progress * 100));
            } else {
              setOcrStatus("Initializing OCR engine...");
            }
          },
        }
      );
      onChange(result.data.text);
    } catch (error) {
      console.error("OCR Error:", error);
      alert("Failed to extract text from the image. Please try again or type manually.");
    } finally {
      setIsOcrLoading(false);
      setOcrStatus("");
      setOcrProgress(0);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  return (
    <section className="rounded-2xl border border-cyan-300/20 bg-gradient-to-br from-slate-900/85 to-slate-800/80 p-6 shadow-2xl shadow-blue-950/40">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-lg font-semibold text-slate-100">Raw Prescription Text</h2>
        <span className="rounded-full border border-cyan-300/30 bg-cyan-500/10 px-3 py-1 text-xs font-medium text-cyan-100">
          Paste • Upload • Extract
        </span>
      </div>
      <p className="mt-1 text-sm text-slate-300">
        Type, paste, or upload a photo of a doctor's note or prescription.
      </p>

      <div className="relative mt-4">
        <textarea
          value={value}
          onChange={(event) => onChange(event.target.value)}
          disabled={isOcrLoading}
          className="min-h-56 w-full rounded-xl border border-slate-500/60 bg-slate-950/60 px-4 py-3 text-sm text-slate-100 outline-none transition focus:border-cyan-400 focus:bg-slate-950/80 focus:ring-4 focus:ring-cyan-400/20 disabled:opacity-50"
          placeholder="Example: Tab Paracetamol 650 mg BD x 5 days..."
        />
        
        {isOcrLoading && (
          <div className="absolute inset-0 flex flex-col items-center justify-center rounded-xl bg-slate-900/80 backdrop-blur-sm">
            <Loader2 className="mb-2 h-8 w-8 animate-spin text-cyan-400" />
            <p className="text-sm font-medium text-cyan-300">{ocrStatus}</p>
            {ocrProgress > 0 && (
              <div className="mt-3 w-48 rounded-full bg-slate-700">
                <div 
                  className="h-1.5 rounded-full bg-cyan-400 transition-all duration-300"
                  style={{ width: `${ocrProgress}%` }}
                />
              </div>
            )}
          </div>
        )}
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-3">
        <input 
          type="file" 
          accept="image/*" 
          className="hidden" 
          ref={fileInputRef}
          onChange={handleImageUpload}
        />
        
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          disabled={isLoading || isOcrLoading}
          className="flex items-center gap-2 rounded-xl border border-slate-400/60 bg-slate-800/70 px-5 py-2.5 text-sm font-semibold text-slate-100 transition hover:bg-slate-700/80 disabled:cursor-not-allowed disabled:text-slate-400"
        >
          <ImagePlus size={16} />
          Upload Image
        </button>

        <button
          type="button"
          onClick={onSubmit}
          disabled={isLoading || isOcrLoading || !value.trim()}
          className="rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-blue-300/40 transition hover:from-blue-700 hover:to-cyan-600 disabled:cursor-not-allowed disabled:from-blue-300 disabled:to-cyan-300"
        >
          {isLoading ? "Structuring Data..." : "Get Structured Data"}
        </button>

        <button
          type="button"
          onClick={onClear}
          disabled={isLoading || isOcrLoading}
          className="rounded-xl border border-slate-400/60 bg-slate-800/70 px-5 py-2.5 text-sm font-semibold text-slate-100 transition hover:bg-slate-700/80 disabled:cursor-not-allowed disabled:text-slate-400"
        >
          Clear
        </button>
      </div>
    </section>
  );
}
