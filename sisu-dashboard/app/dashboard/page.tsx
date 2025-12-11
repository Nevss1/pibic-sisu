"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import CursoSelect from "./components/CursoSelect";

const Plot = dynamic(() => import("react-plotly.js"), { ssr: false });

export default function Dashboard() {
  const [curso, setCurso] = useState("");
  const [dados, setDados] = useState([]);
  const [distribuicao, setDistribuicao] = useState([]);

  async function buscarDados(cursoNome: string) {
    const res = await fetch(`/api/serie-temporal?curso=${encodeURIComponent(cursoNome)}`);
    const json = await res.json();
    setDados(json);
  }

  async function buscarDistribuicao(cursoNome: string) {
    if (!cursoNome) return;

    const res = await fetch(`/api/distribuicao?curso=${encodeURIComponent(cursoNome)}`);
    const json = await res.json();
    console.log(json)
    setDistribuicao(json);
  }

  return (
    <div className="min-h-screen p-10 bg-gray-50">
      <h1 className="text-4xl font-bold mb-6 text-gray-800">
        📊 Dashboard SISU UFMA
      </h1>

      {dados.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          
          <div className="bg-black p-5 rounded shadow">
            <h3 className="text-gray-500 text-sm">Primeiro Ano</h3>
            <p className="text-2xl font-bold">{dados[0].ano}</p>
          </div>

          <div className="bg-black p-5 rounded shadow">
            <h3 className="text-gray-500 text-sm">Último Ano</h3>
            <p className="text-2xl font-bold">{dados[dados.length - 1].ano}</p>
          </div>

          <div className="bg-black p-5 rounded shadow">
            <h3 className="text-gray-500 text-sm">Média Nota de Corte</h3>
            <p className="text-2xl font-bold">
              {(
                dados.reduce((acc, x) => acc + Number(x.media_nota_corte), 0) /
                dados.length
              ).toFixed(2)}
            </p>
          </div>
        </div>
      )}


      {/* Campo de busca */}
      <div className="flex gap-3 mb-6">
        <CursoSelect
          onCursoSelecionado={(cursoEscolhido) => {
            setCurso(cursoEscolhido);
            buscarDados(cursoEscolhido);
            buscarDistribuicao(cursoEscolhido);
          }}
        />

        <button
          onClick={() => buscarDados(curso)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded"
        >
          Buscar
        </button>
      </div>

      {/* Gráfico */}
      {dados.length > 0 && (
        <Plot
          data={[
            {
              x: dados.map((d) => d.ano),
              y: dados.map((d) => Number(d.media_nota_candidato)),
              type: "scatter",
              mode: "lines+markers",
              name: "Média Nota do Candidato",
            },
            {
              x: dados.map((d) => d.ano),
              y: dados.map((d) => Number(d.media_nota_corte)),
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

      {distribuicao.length > 0 && (
        <div className="bg-white p-6 rounded shadow mt-10">
          <Plot
            data={[
              {
                x: distribuicao.map((d) => Number(d.nu_nota_candidato)),
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
    </div>
  );
}
