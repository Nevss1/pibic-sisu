"use client";

import { useEffect, useState } from "react";
import Plot from "react-plotly.js";

export default function DashboardPage() {
  const [curso, setCurso] = useState("MEDICINA");
  const [dados, setDados] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      const res = await fetch(`/api/serie-temporal?curso=${encodeURIComponent(curso)}`);
      const json = await res.json();
      setDados(json);
      setLoading(false);
    }
    fetchData();
  }, [curso]);

  const anos = dados.map((d) => d.ano);
  const mediaCand = dados.map((d) => d.media_nota_candidato);
  const mediaCorte = dados.map((d) => d.media_nota_corte);

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-6">Dashboard SISU UFMA</h1>

      <input
        className="border rounded px-4 py-2 text-black mb-6"
        value={curso}
        onChange={(e) => setCurso(e.target.value)}
        placeholder="Digite o nome do curso"
      />

      {loading && <p>Carregando...</p>}

      {!loading && dados.length > 0 && (
        <Plot
          data={[
            {
              x: anos,
              y: mediaCand,
              type: "scatter",
              mode: "lines+markers",
              name: "Nota Média dos Candidatos",
            },
            {
              x: anos,
              y: mediaCorte,
              type: "scatter",
              mode: "lines+markers",
              name: "Nota Média de Corte",
            },
          ]}
          layout={{
            title: `Série Temporal — ${curso}`,
          }}
          style={{ width: "100%", height: 500 }}
        />
      )}
    </div>
  );
}
