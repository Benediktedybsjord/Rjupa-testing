import React, { createContext, useContext, useMemo, useState } from "react";

type AnalysisContextValue = {
  analysisBalance: number;
  addAnalyses: (amount: number) => void;
  consumeAnalysis: () => boolean;
  canStartAnalysis: boolean;
  resetAnalyses: () => void;
};

const AnalysisContext = createContext<AnalysisContextValue | undefined>(
  undefined
);

export function AnalysisProvider({ children }: { children: React.ReactNode }) {
  // midlertidig, byttes ut med firebase senere
  const [analysisBalance, setAnalysisBalance] = useState<number>(12);

  const addAnalyses = (amount: number) => {
    // Guard against invalid values
    if (amount <= 0) return;
    setAnalysisBalance((prev) => prev + amount);
  };

  const consumeAnalysis = () => {
    // Deduct only if there is balance available
    let didConsume = false;

    setAnalysisBalance((prev) => {
      if (prev <= 0) return prev;
      didConsume = true;
      return prev - 1;
    });

    return didConsume;
  };

  const resetAnalyses = () => {
    // Helpful during development/testing
    setAnalysisBalance(0);
  };

  const value = useMemo(
    () => ({
      analysisBalance,
      addAnalyses,
      consumeAnalysis,
      canStartAnalysis: analysisBalance > 0,
      resetAnalyses,
    }),
    [analysisBalance]
  );

  return (
    <AnalysisContext.Provider value={value}>
      {children}
    </AnalysisContext.Provider>
  );
}

export function useAnalysis() {
  const ctx = useContext(AnalysisContext);
  if (!ctx) {
    throw new Error("useAnalysis must be used within an AnalysisProvider");
  }
  return ctx;
}
