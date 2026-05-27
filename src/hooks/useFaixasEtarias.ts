import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { fetchFaixasEtarias } from "../utils";

/**
 * Busca a distribuição de inscrições por faixa etária estimada
 * (Silver → agregada por ano / campus / faixa_etaria).
 *
 * Os dados são carregados em bulk (todos os campuses e anos) para que o
 * componente possa filtrar no frontend, mantendo consistência com os
 * demais hooks da página /geral.
 *
 * Nunca expõe dt_nascimento nem idades individuais.
 */
export function useFaixasEtarias() {
  return useQuery({
    queryKey: ["faixas-etarias"],
    queryFn: () => fetchFaixasEtarias(),
    placeholderData: keepPreviousData,
  });
}
