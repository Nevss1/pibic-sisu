import { useQuery } from "@tanstack/react-query";
import { fetchDadosCurso } from "../utils";

export function useCursoOverview(curso?: string) {
  return useQuery({
    queryKey: ["curso-overview", curso ?? "all"],
    queryFn: () => fetchDadosCurso(curso),
  })
}