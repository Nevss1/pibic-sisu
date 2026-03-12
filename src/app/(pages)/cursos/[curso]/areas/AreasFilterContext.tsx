"use client";

import { useAreasNotasCurso } from "@/src/hooks";
import { DadoAreasCurso } from "@/src/types/sisu";
import { createContext, useContext } from "react";
import { YearFilterProvider, useYearFilter } from "../../../YearFilterContext";
import { CampusFilterProvider, useCampusFilter } from "../../../CampusFilterContext";

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
  const campusDisponiveis = [...new Set(dados?.map((d) => d.campus) ?? [])].sort();

  return (
    <YearFilterProvider anosDisponiveis={anosDisponiveis}>
      <CampusFilterProvider campusDisponiveis={campusDisponiveis}>
        <AreasFilterInner dados={dados}>{children}</AreasFilterInner>
      </CampusFilterProvider>
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
  const { campusSelecionado } = useCampusFilter();
  const dadosFiltrados = dados?.filter((d) => anosSelecionados.includes(d.ano) && d.campus === campusSelecionado);

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
