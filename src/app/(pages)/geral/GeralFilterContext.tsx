"use client";

import { useCursoOverview } from "@/src/hooks";
import { DadoOverviewCurso } from "@/src/types/sisu";
import { createContext, useContext } from "react";
import { useYearFilter, YearFilterProvider } from "../YearFilterContext";
import { CampusFilterProvider, useCampusFilter } from "../CampusFilterContext";


type GeralFilterContextType = {
  dadosFiltrados: DadoOverviewCurso[] | undefined;
};

const GeralFilterContext = createContext<GeralFilterContextType | null>(null);

export function GeralFilterProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const { data: dados } = useCursoOverview();
  const anosDisponiveis = [...new Set(dados?.map((d) => d.ano) ?? [])].sort();
  const campusDisponiveis = [...new Set(dados?.map((d) => d.campus) ?? [])].sort();

  return (
    <YearFilterProvider anosDisponiveis={anosDisponiveis}>
      <CampusFilterProvider campusDisponiveis={campusDisponiveis}>
        <GeralFilterInner dados={dados}>{children}</GeralFilterInner>
      </CampusFilterProvider>
    </YearFilterProvider>
  );
}

function GeralFilterInner({
  dados,
  children,
}: {
  dados: DadoOverviewCurso[] | undefined;
  children: React.ReactNode;
}) {
  const { anosSelecionados } = useYearFilter();
  const { campusSelecionado } = useCampusFilter();
  const dadosFiltrados = dados?.filter((d) => anosSelecionados.includes(d.ano) && d.campus === campusSelecionado);

  return (
    <GeralFilterContext.Provider value={{ dadosFiltrados }}>
      {children}
    </GeralFilterContext.Provider>
  );
}

export function useGeralFilter() {
  const ctx = useContext(GeralFilterContext);
  if (!ctx) throw new Error("useGeralFilter must be used within GeralFilterProvider");
  return ctx;
}
