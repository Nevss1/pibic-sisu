"use client";

import { CampusFilterProvider, useCampusFilter } from "@/src/features";
import { useYearFilter, YearFilterProvider } from "@/src/features/shared/contexts/YearFilterContext";
import { useCursoOverview } from "@/src/hooks";
import { DadoOverviewCurso } from "@/src/types/sisu";
import { Box, CircularProgress } from "@mui/material";
import { createContext, useContext } from "react";

type CursoFilterContextType = {
  curso: string;
  dadosFiltrados: DadoOverviewCurso[] | undefined;
  dadosTodosPeriodos: DadoOverviewCurso[] | undefined;
  isLoading: boolean;
};

const CursoFilterContext = createContext<CursoFilterContextType | null>(null);

export function CursoFilterProvider({
  curso,
  children,
}: {
  curso?: string;
  children: React.ReactNode;
}) {
  const { data: dados, isLoading } = useCursoOverview(curso);

  if (isLoading) return <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh"><CircularProgress color="primary" /></Box>;

  const anosDisponiveis = [...new Set(dados?.map((d) => d.ano) ?? [])].sort();
  const campusDisponiveis = [...new Set(dados?.map((d) => d.campus) ?? [])].sort();

  return (
    <YearFilterProvider anosDisponiveis={anosDisponiveis}>
      <CampusFilterProvider campusDisponiveis={campusDisponiveis}>
        <CursoFilterInner curso={curso ?? ""} dados={dados} isLoading={isLoading}>{children}</CursoFilterInner>
      </CampusFilterProvider>
    </YearFilterProvider>
  );
}

function CursoFilterInner({
  curso,
  dados,
  isLoading,
  children,
}: {
  curso: string;
  dados: DadoOverviewCurso[] | undefined;
  isLoading: boolean;
  children: React.ReactNode;
}) {
  const { anosSelecionados } = useYearFilter();
  const { campusSelecionado } = useCampusFilter();
  const dadosFiltrados = dados?.filter((d) => anosSelecionados.includes(d.ano) && d.campus === campusSelecionado);
  const dadosTodosPeriodos = dados?.filter((d) => d.campus === campusSelecionado);

  return (
    <CursoFilterContext.Provider value={{ curso, dadosFiltrados, dadosTodosPeriodos, isLoading }}>
      {children}
    </CursoFilterContext.Provider>
  );
}

export function useCursoFilter() {
  const ctx = useContext(CursoFilterContext);
  if (!ctx) throw new Error("useCursoFilter must be used within CursoFilterProvider");
  return ctx;
}
