import { useQuery } from "@tanstack/react-query";
import { fetchHistoricoGeral } from "../utils";

export function useHistoricoGeral() {
  return useQuery({
    queryKey: ["historico"],
    queryFn: fetchHistoricoGeral,
  });
}
