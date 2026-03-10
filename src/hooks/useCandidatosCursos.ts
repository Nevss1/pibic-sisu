import { useQuery } from "@tanstack/react-query";
import { fetchCandidatosCursos } from "../utils";

export function useCandidatosCursos(ano?: string, limit?: number) {
  return useQuery({
    queryKey: ["candidatos", ano, limit],
    queryFn: () => fetchCandidatosCursos(ano, limit),
  });
}
