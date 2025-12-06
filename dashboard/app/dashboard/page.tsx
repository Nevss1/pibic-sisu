"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import CursoSelect from "./components/CursoSelect";

const Plot = dynamic(() => import("react-plotly.js"), { ssr: false });

export default function Dashboard() {
  const [curso, setCurso] = useState("");
  const [dados, setDados] = useState([]);

  async function buscarDados(cursoNome: string) {
    const res = await fetch(
      `/api/serie-temporal?curso=${encodeURIComponent(cursoNome)}`
    );
    const json = await res.json();
    setDados(json);
  }

  return (
    <div className="min-h-screen p-10 bg-gray-50">
      <h1 className="text-4xl font-bold mb-6 text-gray-800">
        📊 Dashboard SISU UFMA
      </h1>

      {/* Campo de busca */}
      <div className="flex gap-3 mb-6">
        <CursoSelect
          onCursoSelecionado={(curso) => {
            setCurso(curso);
            buscarDados(curso);
          }}
        />

        <button
          onClick={buscarDados}
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
    </div>
  );
}
