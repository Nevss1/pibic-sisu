"use client";

import { Card } from "@/app/components";
import { calcularMedia, calcularTotalCandidatos } from "@/app/utils";
import { useDashboard } from "@/app/hooks";
import { useEffect } from "react";
import { LineChart } from "@mui/x-charts/LineChart";
import { BarChart } from "@mui/x-charts/BarChart";

export default function Home() {
  const { dados, buscarDadosTotal, rankingConcorridos, buscarRankingConcorridos } = useDashboard();

  useEffect(() => {
    buscarDadosTotal();
    buscarRankingConcorridos();
  }, []);

  const totalCandidatos = calcularTotalCandidatos(dados);
  const mediaNotaCandidato = calcularMedia(dados, "media_nota_candidato");
  const mediaNotaCorte = calcularMedia(dados, "media_nota_corte");
  const taxaAprovacao = calcularMedia(dados, "taxa_aprovacao");

  const anos = dados.map((d) => d.ano);

  return (
    <div className="min-h-screen p-10 bg-[#FFF] rounded-lg">
      <h1 className="text-4xl font-bold mb-6 text-gray-800">
        Panorama Geral do SISU UFMA
      </h1>

      <div className="flex gap-4 mb-6">
        <Card title="Candidatos" data={totalCandidatos} />
        <Card title="Nota média" data={mediaNotaCandidato} />
        <Card title="Nota de corte média" data={mediaNotaCorte} />
        <Card title="Taxa de Aprovação" data={`${taxaAprovacao}%`} />
      </div>

      <LineChart
        xAxis={[{ data: anos, scaleType: "point" }]}
        series={[
          { data: dados.map((d) => d.media_nota_candidato), label: "Nota Média do Candidato", color: "#2563eb", showMark: false },
          { data: dados.map((d) => d.media_nota_corte), label: "Nota de Corte", color: "#dc2626", showMark: false },
        ]}
        height={300}
      />

      <LineChart
        xAxis={[{ data: anos, scaleType: "point" }]}
        series={[
          { data: dados.map((d) => Number(d.total_inscritos)), label: "Total de candidatos", color: "#2563eb", area: true, showMark: false },
        ]}
        height={300}
      />

      <BarChart
        xAxis={[{ data: anos, scaleType: "band" }]}
        series={[
          { data: dados.map((d) => Number(d.total_inscritos)), label: "Total de inscritos", color: "#6d97f1" },
        ]}
        height={300}
        borderRadius={10}
      />

      <BarChart
        xAxis={[{ data: rankingConcorridos.map((d) => String(d.no_curso)), scaleType: "band" }]}
        series={[
          { data: rankingConcorridos.map((d) => Number(d.razao_inscritos_por_vaga)), label: "Razão inscritos/vaga", color: "#6d97f1" },
        ]}
        height={300}
        borderRadius={10}
      />
    </div>
  );
}
