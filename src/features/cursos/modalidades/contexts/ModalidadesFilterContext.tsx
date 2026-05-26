"use client";

import { CampusFilterProvider, useCampusFilter, useYearFilter, YearFilterProvider } from "@/src/features/shared";
import { useModalidadesCurso } from "@/src/hooks";
import { DadoModalidadesCurso } from "@/src/types/sisu";
import { Box, CircularProgress } from "@mui/material";
import { createContext, useContext } from "react";

type ModalidadesFilterContextType = {
  dadosFiltrados: DadoModalidadesCurso[] | undefined;
  dadosTodosPeriodos: DadoModalidadesCurso[] | undefined;
  isLoading: boolean;
};

const ModalidadesFilterContext = createContext<ModalidadesFilterContextType | null>(null);

export function ModalidadesFilterProvider({
  curso,
  children,
}: {
  curso: string;
  children: React.ReactNode;
}) {
  const { data: dados, isLoading } = useModalidadesCurso(curso);

  if (isLoading) return <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh"><CircularProgress color="primary" /></Box>;

  const anosDisponiveis = [...new Set(dados?.map((d) => d.ano) ?? [])].sort();
  const campusDisponiveis = [...new Set(dados?.map((d) => d.campus) ?? [])].sort();

  return (
    <YearFilterProvider anosDisponiveis={anosDisponiveis}>
      <CampusFilterProvider campusDisponiveis={campusDisponiveis}>
        <ModalidadesFilterInner dados={dados} isLoading={isLoading}>{children}</ModalidadesFilterInner>
      </CampusFilterProvider>
    </YearFilterProvider>
  );
}

function ModalidadesFilterInner({
  dados,
  isLoading,
  children,
}: {
  dados: DadoModalidadesCurso[] | undefined;
  isLoading: boolean;
  children: React.ReactNode;
}) {
  const { anosSelecionados } = useYearFilter();
  const { campusSelecionado } = useCampusFilter();
  const dadosFiltrados = dados?.filter((d) => anosSelecionados.includes(d.ano) && d.campus === campusSelecionado);
  const dadosTodosPeriodos = dados?.filter((d) => d.campus === campusSelecionado);

  return (
    <ModalidadesFilterContext.Provider value={{ dadosFiltrados, dadosTodosPeriodos, isLoading }}>
      {children}
    </ModalidadesFilterContext.Provider>
  );
}

export function useModalidadesFilter() {
  const ctx = useContext(ModalidadesFilterContext);
  if (!ctx) throw new Error("useModalidadesFilter must be used within ModalidadesFilterProvider");
  return ctx;
}
