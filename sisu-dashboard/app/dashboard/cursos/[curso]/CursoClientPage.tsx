"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";

const Plot = dynamic(() => import("react-plotly.js"), { ssr: false });

export default function CursoClientPage({ curso }) {
  const [serie, setSerie] = useState([]);
  const [modalidades, setModalidades] = useState([]);

  async function carregarDados() {
    const res = await fetch(`/api/curso?curso=${encodeURIComponent(curso)}`);
    const json = await res.json();

    console.log("Retorno completo da API:", json);

    setSerie(json.serie);
    setModalidades(json.modalidades);
  }

  useEffect(() => {
    carregarDados();
  }, [curso]);

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 p-10">
      <h1 className="text-5xl font-bold mb-10 text-white">{curso}</h1>

      {/* Gráfico de série temporal */}
      {serie.length > 0 && (
        <div className="bg-gray-800 p-6 rounded-xl shadow-xl mb-10">
          <Plot
            data={[
              {
                x: serie.map((d) => d.ano),
                y: serie.map((d) => d.media_nota_candidato),
                type: "scatter",
                mode: "lines+markers",
                name: "Nota média candidato",
                line: { color: "#60A5FA" },
              },
              {
                x: serie.map((d) => d.ano),
                y: serie.map((d) => d.media_nota_corte),
                type: "scatter",
                mode: "lines+markers",
                name: "Nota de Corte",
                line: { color: "#F87171" },
              },
            ]}
            layout={{
              paper_bgcolor: "rgba(0,0,0,0)",
              plot_bgcolor: "rgba(0,0,0,0)",
              font: { color: "white" },
              title: { text: `Série Temporal – ${curso}` },
              xaxis: { title: "Ano" },
              yaxis: { title: "Notas ENEM" },
            }}
          />
        </div>
      )}

      {/* Modalidades */}
      <h2 className="text-3xl font-semibold mt-12 mb-4 text-white">Modalidades no SISU</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {modalidades.length === 0 && (
          <p className="text-gray-400">Nenhuma modalidade encontrada…</p>
        )}

        {modalidades.map((m) => (
          <div
            key={m.ds_mod_concorrencia}
            className="bg-gray-800 p-5 rounded-xl shadow-md border border-gray-700"
          >
            <h3 className="font-bold text-lg text-blue-300">
              {m.ds_mod_concorrencia}
            </h3>

            <p className="mt-2 text-gray-300">
              Nota média dos candidatos:{" "}
              <span className="font-semibold text-white">
                {Number(m.media_nota_candidato).toFixed(2)}
              </span>
            </p>

            <p className="mt-1 text-gray-300">
              Nota de corte média:{" "}
              <span className="font-semibold text-white">
                {Number(m.media_nota_corte).toFixed(2)}
              </span>
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
