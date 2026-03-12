"use client";

import { useAreasNotasCurso, useAreasNotasUFMA } from "@/src/hooks";
import { DadoAreasCurso } from "@/src/types/sisu";
import { Box, CircularProgress } from "@mui/material";
import { createContext, useContext } from "react";
import { YearFilterProvider, useYearFilter } from "../../../YearFilterContext";
import { CampusFilterProvider, useCampusFilter } from "../../../CampusFilterContext";

type AreasFilterContextType = {
  dadosFiltrados: DadoAreasCurso[] | undefined;
  dadosUFMAFiltrados: DadoAreasCurso[] | undefined;
  isLoading: boolean;
};

const AreasFilterContext = createContext<AreasFilterContextType | null>(null);

export function AreasFilterProvider({
  curso,
  children,
}: {
  curso: string;
  children: React.ReactNode;
}) {
  const { data: dados, isLoading } = useAreasNotasCurso(curso);

  if (isLoading) return <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh"><CircularProgress color="primary" /></Box>;

  const anosDisponiveis = [...new Set(dados?.map((d) => d.ano) ?? [])].sort();
  const campusDisponiveis = [...new Set(dados?.map((d) => d.campus) ?? [])].sort();

  return (
    <YearFilterProvider anosDisponiveis={anosDisponiveis}>
      <CampusFilterProvider campusDisponiveis={campusDisponiveis}>
        <AreasFilterInner dados={dados} isLoading={isLoading}>{children}</AreasFilterInner>
      </CampusFilterProvider>
    </YearFilterProvider>
  );
}

function AreasFilterInner({
  dados,
  isLoading,
  children,
}: {
  dados: DadoAreasCurso[] | undefined;
  isLoading: boolean;
  children: React.ReactNode;
}) {
  const { anosSelecionados } = useYearFilter();
  const { campusSelecionado } = useCampusFilter();
  const { data: dadosUFMA } = useAreasNotasUFMA();

  const dadosFiltrados = dados?.filter((d) => anosSelecionados.includes(d.ano) && d.campus === campusSelecionado);
  const dadosUFMAFiltrados = dadosUFMA?.filter((d) => anosSelecionados.includes(d.ano) && d.campus === campusSelecionado);

  return (
    <AreasFilterContext.Provider value={{ dadosFiltrados, dadosUFMAFiltrados, isLoading }}>
      {children}
    </AreasFilterContext.Provider>
  );
}

export function useAreasFilter() {
  const ctx = useContext(AreasFilterContext);
  if (!ctx) throw new Error("useAreasFilter must be used within AreasFilterProvider");
  return ctx;
}
