import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { useSearchParams } from "next/navigation";
import { fetchDadosCurso } from "../utils";

export function useCursoOverview(curso?: string) {
  const searchParams = useSearchParams();
  const edicao = searchParams.get("edicao") ?? undefined;

  return useQuery({
    queryKey: ["curso-overview", curso ?? "all", edicao],
    queryFn: () => fetchDadosCurso(curso, edicao),
    placeholderData: keepPreviousData,
  });
}
