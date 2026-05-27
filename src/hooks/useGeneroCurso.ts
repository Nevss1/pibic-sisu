import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { useSearchParams } from "next/navigation";
import { fetchGeneroCurso } from "../utils/fetchers";

export function useGeneroCurso(curso: string) {
  const searchParams = useSearchParams();
  const edicao = searchParams.get("edicao") ?? undefined;

  return useQuery({
    queryKey: ["genero-curso", curso, edicao],
    queryFn: () => fetchGeneroCurso(curso, edicao),
    enabled: !!curso,
    placeholderData: keepPreviousData,
  });
}
