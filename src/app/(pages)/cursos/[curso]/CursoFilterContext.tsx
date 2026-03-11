"use client";

import { useCursoOverview } from "@/src/hooks";
import { DadoOverviewCurso } from "@/src/types/sisu";
import { createContext, useContext } from "react";
import { YearFilterProvider, useYearFilter } from "../../YearFilterContext";
import { CampusFilterProvider, useCampusFilter } from "../../CampusFilterContext";

type CursoFilterContextType = {
  dadosFiltrados: DadoOverviewCurso[] | undefined;
};

const CursoFilterContext = createContext<CursoFilterContextType | null>(null);

export function CursoFilterProvider({
  curso,
  children,
}: {
  curso?: string;
  children: React.ReactNode;
}) {
  const { data: dados } = useCursoOverview(curso);
  const anosDisponiveis = [...new Set(dados?.map((d) => d.ano) ?? [])].sort();
  const campusDisponiveis = [...new Set(dados?.map((d) => d.campus) ?? [])].sort();

  return (
    <YearFilterProvider anosDisponiveis={anosDisponiveis}>
      <CampusFilterProvider campusDisponiveis={campusDisponiveis}>
        <CursoFilterInner dados={dados}>{children}</CursoFilterInner>
      </CampusFilterProvider>
    </YearFilterProvider>
  );
}

function CursoFilterInner({
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
    <CursoFilterContext.Provider value={{ dadosFiltrados }}>
      {children}
    </CursoFilterContext.Provider>
  );
}

export function useCursoFilter() {
  const ctx = useContext(CursoFilterContext);
  if (!ctx) throw new Error("useCursoFilter must be used within CursoFilterProvider");
  return ctx;
}
