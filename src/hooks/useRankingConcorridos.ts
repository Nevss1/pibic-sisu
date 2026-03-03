import { useQuery } from "@tanstack/react-query";
import { fetchRankingConcorridos } from "../utils";

export function useRankingConcorridos(ano?: string) {
  return useQuery({
    queryKey: ["ranking", ano],
    queryFn: () => fetchRankingConcorridos(ano),
  });
}
