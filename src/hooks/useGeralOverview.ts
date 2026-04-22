import { useQuery } from "@tanstack/react-query";
import { fetchDadosCurso } from "../utils";

export function useGeralOverview() {
  return useQuery({
    queryKey: ["geral-overview"],
    queryFn: () => fetchDadosCurso(),
  });
}
