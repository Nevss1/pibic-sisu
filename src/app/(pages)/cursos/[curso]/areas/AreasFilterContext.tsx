"use client";

import { useAreasNotasCurso } from "@/src/hooks";
import { DadoAreasCurso } from "@/src/types/sisu";
import { createContext, useContext } from "react";
import { YearFilterProvider, useYearFilter } from "../../../YearFilterContext";

type AreasFilterContextType = {
  dadosFiltrados: DadoAreasCurso[] | undefined;
};

const AreasFilterContext = createContext<AreasFilterContextType | null>(null);

export function AreasFilterProvider({
  curso,
  children,
}: {
  curso: string;
  children: React.ReactNode;
}) {
  const { data: dados } = useAreasNotasCurso(curso);
  const anosDisponiveis = [...new Set(dados?.map((d) => d.ano) ?? [])].sort();

  return (
    <YearFilterProvider anosDisponiveis={anosDisponiveis}>
      <AreasFilterInner dados={dados}>{children}</AreasFilterInner>
    </YearFilterProvider>
  );
}

function AreasFilterInner({
  dados,
  children,
}: {
  dados: DadoAreasCurso[] | undefined;
  children: React.ReactNode;
}) {
  const { anosSelecionados } = useYearFilter();
  const dadosFiltrados = dados?.filter((d) => anosSelecionados.includes(d.ano));

  return (
    <AreasFilterContext.Provider value={{ dadosFiltrados }}>
      {children}
    </AreasFilterContext.Provider>
  );
}

export function useAreasFilter() {
  const ctx = useContext(AreasFilterContext);
  if (!ctx) throw new Error("useAreasFilter must be used within AreasFilterProvider");
  return ctx;
}
