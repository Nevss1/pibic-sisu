"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import { Dados } from "../types/sisu";
import CursoSelect from "../components/CursoSelect";
import { Card } from "../components/Card";

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

    const res = await fetch(
      `/api/dados?curso=${encodeURIComponent(cursoNome)}`
    );
    const json = await res.json();

    setDados(json);
    setAnosSelecionados([]); // reseta filtro ao trocar curso
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

      {/* CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
        <Card title="Candidatos" data={totalCandidatos} />
        <Card title="Nota média" data={mediaNotaCandidato} />
        <Card title="Nota de corte média" data={mediaNotaCorte} />
        <Card title="Taxa de Aprovação" data={`${taxaAprovacao}%`} />
      </div>

      {/* Seleção de curso */}
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

      {dados.length > 0 && (
        <div className="flex gap-2 mb-6">
          {anos.map((ano) => (
            <button
              key={ano}
              onClick={() =>
                setAnosSelecionados((prev) =>
                  prev.includes(ano)
                    ? prev.filter((a) => a !== ano)
                    : [...prev, ano]
                )
              }
              className={`px-4 py-2 rounded ${
                anosSelecionados.includes(ano)
                  ? "bg-blue-600 text-white"
                  : "bg-gray-300 text-gray-800"
              }`}
            >
              {ano}
            </button>
          ))}

          <button
            onClick={() => setAnosSelecionados([])}
            className={`px-4 py-2 rounded ${
              anosSelecionados.length === 0
                ? "bg-blue-600 text-white"
                : "bg-gray-200 text-gray-700"
            }`}
          >
            Todos
          </button>
        </div>
      )}

      {dadosPorAno.length > 0 && (
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
            style={{ width: "100%", height: "500px" }}
          />
        </div>
      )}

      {dadosPorAno.length > 0 && (
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
      )}

      <Plot
        data={[
          {
            x: dadosPorAno.map((d) => d.ano),
            y: dadosPorAno.flatMap((d) => d.notas),
            type: "box",
            name: "Distribuição por Ano",
            boxpoints: "outliers",
          },
        ]}
        layout={{
          title: `Boxplot das Notas — ${curso}`,
          xaxis: { title: "Ano" },
          yaxis: { title: "Nota do candidato" },
        }}
        style={{ width: "100%", height: "500px" }}
      />

      <Plot
        data={[
          {
            z: anos.map(
              (ano) => dadosPorAno.find((d) => d.ano === ano)?.notas.length || 0
            ),
            x: anos,
            y: ["Frequência"],
            type: "heatmap",
            colorscale: "Blues",
          },
        ]}
        layout={{
          title: `Heatmap de quantidade de candidatos por ano`,
          xaxis: { title: "Ano" },
        }}
        style={{ width: "100%", height: "300px" }}
      />

      <Plot
        data={[
          {
            x: dadosPorAno.flatMap((d) => d.notas),
            y: dadosPorAno.flatMap((d) => d.classificacao || []),
            mode: "markers",
            type: "scatter",
            marker: { size: 6 },
            name: "Distribuição",
          },
        ]}
        layout={{
          title: `Relação Nota x Classificação — ${curso}`,
          xaxis: { title: "Nota do candidato" },
          yaxis: { title: "Classificação (quanto menor melhor)" },
        }}
        style={{ width: "100%", height: "500px" }}
      />
    </div>
  );
}
