"use client";

import { useCursoOverview } from "@/src/hooks";
import { DadoOverviewCurso } from "@/src/types/sisu";
import { createContext, useContext, useEffect, useState } from "react";

type CursoFilterContextType = {
  dadosFiltrados: DadoOverviewCurso[] | undefined;
  anosDisponiveis: string[];
  anosSelecionados: string[];
  setAnosSelecionados: (anos: string[]) => void;
};

const CursoFilterContext = createContext<CursoFilterContextType | null>(null);

export function CursoFilterProvider({
  curso,
  children,
}: {
  curso: string;
  children: React.ReactNode;
}) {
  const { data: dados } = useCursoOverview(curso);
  const [anosSelecionados, setAnosSelecionados] = useState<string[]>([]);

  const anosDisponiveis = [...new Set(dados?.map((d) => d.ano) ?? [])].sort();

  useEffect(() => {
    if (anosDisponiveis.length > 0 && anosSelecionados.length === 0) {
      setAnosSelecionados(anosDisponiveis);
    }
  }, [anosDisponiveis.join(",")]);

  const dadosFiltrados = dados?.filter((d) => anosSelecionados.includes(d.ano));

  return (
    <CursoFilterContext.Provider
      value={{ dadosFiltrados, anosDisponiveis, anosSelecionados, setAnosSelecionados }}
    >
      {children}
    </CursoFilterContext.Provider>
  );
}

export function useCursoFilter() {
  const ctx = useContext(CursoFilterContext);
  if (!ctx) throw new Error("useCursoFilter must be used within CursoFilterProvider");
  return ctx;
}
