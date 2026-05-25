import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { useSearchParams } from "next/navigation";
import { fetchModalidadesCurso } from "../utils/fetchers";

export function useModalidadesCurso(curso: string) {
  const searchParams = useSearchParams();
  const edicao = searchParams.get("edicao") ?? undefined;

  return useQuery({
    queryKey: ["modalidades-curso", curso, edicao],
    queryFn: () => fetchModalidadesCurso(curso, edicao),
    enabled: !!curso,
    placeholderData: keepPreviousData,
  });
}
