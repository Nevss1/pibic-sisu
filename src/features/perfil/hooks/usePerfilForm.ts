"use client";

import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchNomesCursos } from "@/src/utils/fetchers";
import type { Opcoes, Resultado, SelectOption } from "../perfil.types";

const EMPTY_OPCOES: Opcoes = { campuses: [], turnos: [], graus: [], modalidades: [] };

export function usePerfilForm() {
  const { data: cursosRaw = [] } = useQuery<{ no_curso: string }[]>({
    queryKey: ["cursos"],
    queryFn: fetchNomesCursos,
  });
  const [opcoes, setOpcoes] = useState<Opcoes>(EMPTY_OPCOES);
  const [loadingOpcoes, setLoadingOpcoes] = useState(false);

  const [curso, setCurso] = useState<string | null>(null);
  const [campus, setCampus] = useState("");
  const [modalidade, setModalidade] = useState("");
  const [turno, setTurno] = useState("");
  const [grau, setGrau] = useState("");
  const [sexo, setSexo] = useState("");

  const [loading, setLoading] = useState(false);
  const [resultado, setResultado] = useState<Resultado | null>(null);
  const [erro, setErro] = useState("");

  function handleCursoChange(novoCurso: string | null) {
    setCurso(novoCurso);
    setCampus("");
    setModalidade("");
    setTurno("");
    setGrau("");
    setResultado(null);
    setErro("");

    if (!novoCurso) {
      setOpcoes(EMPTY_OPCOES);
      return;
    }

    setLoadingOpcoes(true);
    fetch(`/api/perfil/opcoes?curso=${encodeURIComponent(novoCurso)}`)
      .then((r) => r.json())
      .then((data: Opcoes) => setOpcoes(data))
      .finally(() => setLoadingOpcoes(false));
  }

  function handleCampusChange(novoCampus: string) {
    setCampus(novoCampus);
    setModalidade("");
    setTurno("");
    setGrau("");
    setResultado(null);
    setErro("");

    if (!novoCampus || !curso) return;

    fetch(`/api/perfil/opcoes?curso=${encodeURIComponent(curso)}&campus=${encodeURIComponent(novoCampus)}`)
      .then((r) => r.json())
      .then((data: Opcoes) =>
        setOpcoes((prev) => ({ ...prev, turnos: data.turnos, graus: data.graus, modalidades: data.modalidades }))
      );
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!curso || !campus) return;

    setLoading(true);
    setErro("");
    setResultado(null);

    const params = new URLSearchParams({ curso, campus, modalidade, turno, grau, sexo });

    try {
      const res = await fetch(`/api/perfil?${params}`);
      if (!res.ok) throw new Error("Erro na requisição");
      const data: Resultado = await res.json();
      if (!data.resumo || data.rows.length === 0) {
        setErro("Nenhum dado encontrado para esse perfil. Tente ampliar os filtros.");
      } else {
        setResultado(data);
      }
    } catch {
      setErro("Ocorreu um erro ao buscar os dados. Tente novamente.");
    } finally {
      setLoading(false);
    }
  }

  const cursoOptions = useMemo<SelectOption[]>(
    () => cursosRaw.map((d) => ({ label: d.no_curso, value: d.no_curso })),
    [cursosRaw]
  );

  const campusOptions = useMemo<SelectOption[]>(
    () => opcoes.campuses.map((c) => ({ label: c, value: c })),
    [opcoes.campuses]
  );

  const turnoOptions = useMemo<SelectOption[]>(
    () => [{ label: "Qualquer turno", value: "" }, ...opcoes.turnos.map((t) => ({ label: t, value: t }))],
    [opcoes.turnos]
  );

  const grauOptions = useMemo<SelectOption[]>(
    () => [{ label: "Qualquer grau", value: "" }, ...opcoes.graus.map((g) => ({ label: g, value: g }))],
    [opcoes.graus]
  );

  const modalidadeOptions = useMemo<SelectOption[]>(
    () => [{ label: "Todas as modalidades", value: "" }, ...opcoes.modalidades.map((m) => ({ label: m, value: m }))],
    [opcoes.modalidades]
  );

  return {
    curso,
    campus,
    modalidade, setModalidade,
    turno, setTurno,
    grau, setGrau,
    sexo, setSexo,
    loading, loadingOpcoes,
    resultado, erro,
    handleCursoChange,
    handleCampusChange,
    handleSubmit,
    cursoOptions, campusOptions, turnoOptions, grauOptions, modalidadeOptions,
  };
}
