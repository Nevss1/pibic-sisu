import { useQuery } from "@tanstack/react-query";
import { fetchAreasNotasCurso } from "../utils";

export function useAreasNotasCurso(curso: string) {
  return useQuery({
    queryKey: ["areas-notas-curso", curso],
    queryFn: () => fetchAreasNotasCurso(curso),
    enabled: !!curso,
  });
}
