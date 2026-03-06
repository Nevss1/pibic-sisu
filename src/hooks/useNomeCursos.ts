import { useQuery } from "@tanstack/react-query";
import { fetchNomesCursos } from "../utils";

export function useNomeCursos() {
  return useQuery({
    queryKey: ["cursos"],
    queryFn: fetchNomesCursos,
  });
}
