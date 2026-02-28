"use client";

import { Card, SerieTemporalArea, SerieTemporalBarra, SerieTemporalLinha } from "@/app/components";
import { calcularMedia, calcularTotalCandidatos } from "@/app/utils";
import { useDashboard } from "@/app/hooks";
import { useEffect } from "react";
import { Bar, BarChart, CartesianGrid, Legend, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

export default function Home() {
  const { dados, buscarDadosTotal, rankingConcorridos, buscarRankingConcorridos } = useDashboard();
  
  useEffect(() => {
    buscarDadosTotal();
    buscarRankingConcorridos();
  }, []);
  console.log(dados);

  const totalCandidatos = calcularTotalCandidatos(dados)
  const mediaNotaCandidato = calcularMedia(dados, "media_nota_candidato")
  const mediaNotaCorte = calcularMedia(dados, "media_nota_corte")
  const taxaAprovacao = calcularMedia(dados, "taxa_aprovacao")

  console.log(rankingConcorridos)
  return (
    <div className="min-h-screen p-10 bg-gray-100 rounded-lg">
      <h1 className="text-4xl font-bold mb-6 text-gray-800">
        Panorama Geral do SISU UFMA
      </h1>

      <div className="flex gap-4 mb-6">
        <Card title="Candidatos" data={totalCandidatos} />
        <Card title="Nota média" data={mediaNotaCandidato} />
        <Card title="Nota de corte média" data={mediaNotaCorte} />
        <Card title="Taxa de Aprovação" data={`${taxaAprovacao}%`} />
      </div>
      
      <SerieTemporalLinha
        dados={dados}
        linhas={[
          { dataKey: "media_nota_candidato", name: "Nota Média do Candidato", stroke: "#2563eb" },
          { dataKey: "media_nota_corte", name: "Nota de Corte", stroke: "#dc2626" },
        ]}
      />
      <SerieTemporalArea
        dados={dados}
        areas={[
          { dataKey: "total_inscritos", name: "Total de candidatos", stroke: "#2563eb" },
        ]}
      />

      <SerieTemporalBarra
        dados={dados}
        barras={[
          { dataKey: "total_inscritos", fill: "#6d97f1" },
        ]}
      />

       <SerieTemporalBarra
        dados={rankingConcorridos}
        xAxisKey="no_curso"
        barras={[
          { dataKey: "razao_inscritos_por_vaga", fill: "#6d97f1" },
        ]}
      />
    </div>
  );
}
