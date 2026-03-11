import { useQuery } from "@tanstack/react-query";
import { fetchModalidadesCurso } from "../utils/fetchers";

export function useModalidadesCurso(curso: string) {
  return useQuery({
    queryKey: ["modalidades-curso", curso],
    queryFn: () => fetchModalidadesCurso(curso),
    enabled: !!curso,
  });
}
