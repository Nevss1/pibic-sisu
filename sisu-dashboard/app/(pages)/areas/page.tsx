"use client";

import { useState } from "react";
import { Card } from "@/app/components";

const AREAS = ["Exatas", "Humanas", "Ciências", "Redação", "Geral"];

export default function AreasPage() {
  const [dados, setDados] = useState<any | null>(null);
  const [areaSelecionada, setAreaSelecionada] = useState("");

  async function carregarArea(area: string) {
    setAreaSelecionada(area);
    const res = await fetch(`/api/area?nome=${area.toLowerCase()}`);
    const json = await res.json();
    setDados(json);
  }

  return (
    <div className="p-10">

      <h1 className="text-3xl font-bold mb-8 text-gray-800">Áreas do ENEM</h1>

      <div className="flex flex-row gap-4 mb-8">
        {AREAS.map((area) => (
          <button
            key={area}
            onClick={() => carregarArea(area)}
            className={`px-5 py-3 rounded 
              ${areaSelecionada === area ? "bg-blue-600 text-white" : "bg-gray-300"}
            `}
          >
            {area}
          </button>
        ))}
      </div>

      {dados && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card title="Total de candidatos" data={dados.total_candidatos} />
          <Card title="Média" data={dados.media} />
          <Card title="Mediana" data={dados.mediana} />
          <Card title="Desvio padrão" data={dados.desvio_padrao} />
        </div>
      )}

    </div>
  );
}
