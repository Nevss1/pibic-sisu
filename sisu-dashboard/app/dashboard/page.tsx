"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import { Dados } from "../types/sisu";
import { fetchDados } from "@/app/utils";
import { Card, YearToggleGroup, CursoSelect } from "@/app/components";

const Plot = dynamic(() => import("react-plotly.js"), { ssr: false });

export default function Dashboard() {
  const [curso, setCurso] = useState("");
  const [dados, setDados] = useState<Dados>([]);
  const [anosSelecionados, setAnosSelecionados] = useState<string[]>([]);

  const dadosPorAno =
    anosSelecionados.length === 0
      ? dados
      : dados.filter((d) => anosSelecionados.includes(d.ano));

  const anos = [...new Set(dados.map((d) => d.ano))];

  async function buscarDados(cursoNome: string) {
    if (!cursoNome) return;

    const json = await fetchDados(cursoNome);

    setDados(json);
    setAnosSelecionados([]);
  }

  const totalCandidatos = dadosPorAno.flatMap((d) => d.notas).length;

  const mediaNotaCandidato =
    dadosPorAno.length > 0
      ? (
          dadosPorAno.reduce((acc, d) => acc + d.media_nota_candidato, 0) /
          dadosPorAno.length
        ).toFixed(2)
      : "0";

  const mediaNotaCorte =
    dadosPorAno.length > 0
      ? (
          dadosPorAno.reduce((acc, d) => acc + d.media_nota_corte, 0) /
          dadosPorAno.length
        ).toFixed(2)
      : "0";

  const taxaAprovacao =
    dadosPorAno.length > 0
      ? (
          dadosPorAno.reduce((acc, d) => acc + d.taxa_aprovacao, 0) /
          dadosPorAno.length
        ).toFixed(2)
      : "0";

  return (
    <div className="min-h-screen p-10 bg-gray-20">
      <h1 className="text-4xl font-bold mb-6 text-gray-800">
        Dashboard SISU UFMA
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
        <Card title="Candidatos" data={totalCandidatos} />
        <Card title="Nota média" data={mediaNotaCandidato} />
        <Card title="Nota de corte média" data={mediaNotaCorte} />
        <Card title="Taxa de Aprovação" data={`${taxaAprovacao}%`} />
      </div>

      <div className="flex gap-3 mb-6">
        <CursoSelect
          onCursoSelecionado={(cursoEscolhido) => {
            setCurso(cursoEscolhido);
            buscarDados(cursoEscolhido);
          }}
        />

        <button
          onClick={() => buscarDados(curso)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded"
        >
          Buscar
        </button>
      </div>

      {dadosPorAno.length > 0 && (
        <YearToggleGroup
          items={anos}
          selected={anosSelecionados}
          onChange={setAnosSelecionados}
        />
      )}

      {dadosPorAno.length > 0 && (
        <div className="w-full flex flex-col object-center items-center">
          <div className="bg-white p-6 rounded shadow mt-10">
            <Plot
              data={[
                {
                  x: dadosPorAno.flatMap((d) => d.notas),
                  type: "histogram",
                  marker: { color: "rgba(0, 0, 255, 0.6)" },
                },
              ]}
              layout={{
                title: `Distribuição das Notas — ${curso}`,
                xaxis: { title: "Nota do candidato" },
                yaxis: { title: "Frequência" },
                bargap: 0.05,
              }}
              style={{ width: "190%", height: "400px" }}
            />
          </div>

          <Plot
            data={[
              {
                x: dadosPorAno.map((d) => d.ano),
                y: dadosPorAno.map((d) => d.media_nota_candidato),
                type: "scatter",
                mode: "lines+markers",
                name: "Média Nota do Candidato",
              },
              {
                x: dadosPorAno.map((d) => d.ano),
                y: dadosPorAno.map((d) => d.media_nota_corte),
                type: "scatter",
                mode: "lines+markers",
                name: "Nota de Corte",
              },
            ]}
            layout={{
              title: `Série temporal — ${curso}`,
              xaxis: { title: "Ano" },
              yaxis: { title: "Notas ENEM" },
            }}
          />
        </div>
      )}
    </div>
  );
}
