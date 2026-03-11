"use client";

import { useModalidadesCurso } from "@/src/hooks";
import { DadoModalidadesCurso } from "@/src/types/sisu";
import { createContext, useContext } from "react";
import { YearFilterProvider, useYearFilter } from "../../../YearFilterContext";
import { CampusFilterProvider, useCampusFilter } from "../../../CampusFilterContext";

type ModalidadesFilterContextType = {
  dadosFiltrados: DadoModalidadesCurso[] | undefined;
};

const ModalidadesFilterContext = createContext<ModalidadesFilterContextType | null>(null);

export function ModalidadesFilterProvider({
  curso,
  children,
}: {
  curso: string;
  children: React.ReactNode;
}) {
  const { data: dados } = useModalidadesCurso(curso);
  const anosDisponiveis = [...new Set(dados?.map((d) => d.ano) ?? [])].sort();
  const campusDisponiveis = [...new Set(dados?.map((d) => d.campus) ?? [])].sort();

  return (
    <YearFilterProvider anosDisponiveis={anosDisponiveis}>
      <CampusFilterProvider campusDisponiveis={campusDisponiveis}>
        <ModalidadesFilterInner dados={dados}>{children}</ModalidadesFilterInner>
      </CampusFilterProvider>
    </YearFilterProvider>
  );
}

function ModalidadesFilterInner({
  dados,
  children,
}: {
  dados: DadoModalidadesCurso[] | undefined;
  children: React.ReactNode;
}) {
  const { anosSelecionados } = useYearFilter();
  const { campusSelecionado } = useCampusFilter();
  const dadosFiltrados = dados?.filter((d) => anosSelecionados.includes(d.ano) && d.campus === campusSelecionado);

  return (
    <ModalidadesFilterContext.Provider value={{ dadosFiltrados }}>
      {children}
    </ModalidadesFilterContext.Provider>
  );
}

export function useModalidadesFilter() {
  const ctx = useContext(ModalidadesFilterContext);
  if (!ctx) throw new Error("useModalidadesFilter must be used within ModalidadesFilterProvider");
  return ctx;
}
