import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { useSearchParams } from "next/navigation";
import { fetchAreasNotasCurso } from "../utils";

export function useAreasNotasCurso(curso: string) {
  const searchParams = useSearchParams();
  const edicao = searchParams.get("edicao") ?? undefined;

  return useQuery({
    queryKey: ["areas-notas-curso", curso, edicao],
    queryFn: () => fetchAreasNotasCurso(curso, edicao),
    enabled: !!curso,
    placeholderData: keepPreviousData,
  });
}
