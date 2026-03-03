import { useQuery } from "@tanstack/react-query";
import { fetchDadosTotal } from "../utils";

export function useDadosTotal() {
  return useQuery({
    queryKey: ["dados"],
    queryFn: fetchDadosTotal,
  });
}
