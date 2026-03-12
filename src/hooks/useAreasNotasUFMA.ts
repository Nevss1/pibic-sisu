import { useQuery } from "@tanstack/react-query";
import { fetchAreasNotasUFMA } from "../utils";

export function useAreasNotasUFMA() {
  return useQuery({
    queryKey: ["areas-notas-ufma"],
    queryFn: () => fetchAreasNotasUFMA(),
  });
}
