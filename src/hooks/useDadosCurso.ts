import { useQuery } from "@tanstack/react-query";
import { fetchDadosdoCurso } from "../utils";

export function useDadosCurso(curso: string) {
  return useQuery({
    queryKey: ["dados", curso],
    queryFn: () => fetchDadosdoCurso(curso),
    enabled: !!curso,
  });
}
