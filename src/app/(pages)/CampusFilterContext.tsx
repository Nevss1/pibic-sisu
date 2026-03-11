import React, { createContext, useContext, useEffect, useState } from "react";

type CampusFilterContextType = {
  campusDisponiveis: string[];
  campusSelecionado: string;
  setCampusSelecionado: (campus: string) => void;
};

const CampusFilterContext = createContext<CampusFilterContextType | null>(null);

export const CampusFilterProvider = ({
  campusDisponiveis = [],
  children,
}: {
  campusDisponiveis?: string[];
  children: React.ReactNode;
}) => {
  const [campusSelecionado, setCampusSelecionado] = useState<string>("");

  useEffect(() => {
    if (campusDisponiveis.length > 0 && campusSelecionado === "") {
      setCampusSelecionado(campusDisponiveis[0]); // seleciona o primeiro por padrão
    }
  }, [campusDisponiveis.join(",")]);

  return (
    <CampusFilterContext.Provider value={{ campusDisponiveis, campusSelecionado, setCampusSelecionado}}>
      {children}
    </CampusFilterContext.Provider>
  );
};

export const useCampusFilter = () => {
  const ctx = useContext(CampusFilterContext);
  if (!ctx)
    throw new Error("useCampusFilter must be used within CampusFilterProvider");
  return ctx;
};
