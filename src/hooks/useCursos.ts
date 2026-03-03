import { useQuery } from "@tanstack/react-query";
import { fetchNomesCursos } from "../utils";

export function useCursos() {
  return useQuery({
    queryKey: ["cursos"],
    queryFn: fetchNomesCursos,
  });
}
