"use client";

import { createContext, useContext, useEffect, useState } from "react";

const DEFAULT_ANOS = ["2018", "2019", "2020", "2021", "2022", "2023"];

type YearFilterContextType = {
  anosDisponiveis: string[];
  anosSelecionados: string[];
  setAnosSelecionados: (anos: string[]) => void;
};

const YearFilterContext = createContext<YearFilterContextType | null>(null);

export function YearFilterProvider({
  anosDisponiveis = DEFAULT_ANOS,
  children,
}: {
  anosDisponiveis?: string[];
  children: React.ReactNode;
}) {
  const [anosSelecionados, setAnosSelecionados] = useState<string[]>([]);

  useEffect(() => {
    if (anosDisponiveis.length > 0 && anosSelecionados.length === 0) {
      setAnosSelecionados([anosDisponiveis[anosDisponiveis.length - 1]]);
    }
  }, [anosDisponiveis.join(",")]);

  return (
    <YearFilterContext.Provider
      value={{ anosDisponiveis, anosSelecionados, setAnosSelecionados }}
    >
      {children}
    </YearFilterContext.Provider>
  );
}

export function useYearFilter() {
  const ctx = useContext(YearFilterContext);
  if (!ctx) throw new Error("useYearFilter must be used within YearFilterProvider");
  return ctx;
}
