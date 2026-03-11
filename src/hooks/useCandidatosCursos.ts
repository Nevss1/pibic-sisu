import { useQuery } from "@tanstack/react-query";
import { fetchCandidatosCursos } from "../utils";

export function useCandidatosCursos() {
  return useQuery({
    queryKey: ["candidatos"],
    queryFn: fetchCandidatosCursos,
  });
}
