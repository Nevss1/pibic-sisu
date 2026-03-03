import { useQuery } from "@tanstack/react-query";
import { fetchHistoricoCurso } from "../utils";

export function useHistoricoCurso(curso: string) {
  return useQuery({
    queryKey: ["historico", curso],
    queryFn: () => fetchHistoricoCurso(curso),
    enabled: !!curso,
  });
}
