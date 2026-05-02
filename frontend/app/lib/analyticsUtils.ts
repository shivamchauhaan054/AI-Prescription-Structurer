import type { ExtractResponse } from "@/app/types/prescription";

export type ExtractionHistoryItem = {
  date: string;
  response: ExtractResponse;
};

export const getHistory = (): ExtractionHistoryItem[] => {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem("extractionHistory");
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
};

export const saveToHistory = (response: ExtractResponse) => {
  if (typeof window === "undefined") return;
  try {
    const history = getHistory();
    history.push({
      date: new Date().toISOString(),
      response,
    });
    localStorage.setItem("extractionHistory", JSON.stringify(history));
  } catch (e) {
    console.error("Failed to save history:", e);
  }
};

export const calculateKPIs = (history: ExtractionHistoryItem[]) => {
  let interactionsPrevented = 0;
  
  history.forEach(item => {
    if (item.response.interactions && item.response.interactions.length > 0) {
      interactionsPrevented += item.response.interactions.length;
    }
  });

  return {
    totalProcessed: history.length,
    interactionsPrevented,
    // Simulated values for demo purposes since we don't track actual time in local storage
    avgProcessingTime: history.length > 0 ? "1.4s" : "0s", 
    accuracyRate: history.length > 0 ? "98.2%" : "0%"
  };
};

export const aggregateDiagnoses = (history: ExtractionHistoryItem[]) => {
  const counts: Record<string, number> = {};
  
  history.forEach(item => {
    item.response.diagnosis.forEach(diag => {
      // Clean up string slightly
      const cleanName = diag.trim();
      counts[cleanName] = (counts[cleanName] || 0) + 1;
    });
  });

  // Convert to array and sort by count descending
  return Object.entries(counts)
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 6); // Top 6
};

export const aggregateActivity = (history: ExtractionHistoryItem[]) => {
  // Initialize last 7 days
  const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const activityMap: Record<string, number> = {};
  
  const today = new Date();
  // Setup the last 7 days in order
  for (let i = 6; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    activityMap[days[d.getDay()]] = 0;
  }

  // Populate actual data
  history.forEach(item => {
    const itemDate = new Date(item.date);
    // Check if item is within the last 7 days
    const diffTime = Math.abs(today.getTime() - itemDate.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); 
    
    if (diffDays <= 7) {
      const dayName = days[itemDate.getDay()];
      if (activityMap[dayName] !== undefined) {
        activityMap[dayName] += 1;
      }
    }
  });

  // Convert map to array preserving the 7 day chronological order
  const result = [];
  for (let i = 6; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    const dayName = days[d.getDay()];
    result.push({ name: dayName, prescriptions: activityMap[dayName] });
  }

  return result;
};
