"use client";

import { calcularMedia, calcularTotalCandidatos } from "@/app/utils";
import { useDashboard } from "@/app/hooks";
import { useEffect } from "react";
import { Box, Grid, Typography, Card } from "@mui/material";
import { LineChart, BarChart } from "@mui/x-charts";

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

  const cards = [
    { label: "Candidatos", value: totalCandidatos },
    { label: "Média de Nota do Candidato", value: mediaNotaCandidato },
    { label: "Média de Nota de Corte", value: mediaNotaCorte },
    { label: "Taxa de Aprovação", value: `${taxaAprovacao}%` },
  ];

  const anos = dados.map((d) => d.ano);

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'white', borderRadius: 2 }}>
      <Typography variant="h4" fontWeight="bold" mb={3} color="text.primary" >
        Panorama Geral do SISU UFMA
      </Typography>

      <Grid container>
        {cards.map((card) => (
          <Grid size={{ xs: 12, md: 3 }} key={card.label}>
            <Card variant="outlined" sx={{ height: 100, p: 2 }}>
              <Typography variant="body2">{card.label}</Typography>
              <Typography variant="h6">{card.value}</Typography>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Box sx={{ p: 4, display: 'flex', flexDirection: 'column', gap: 4 }}>
        <Card variant="outlined" >
          <LineChart
            xAxis={[{ data: anos, scaleType: "point" }]}
            series={[
              { data: dados.map((d) => d.media_nota_candidato), label: "Nota Média do Candidato", color: "#2563eb", showMark: false },
              { data: dados.map((d) => d.media_nota_corte), label: "Nota de Corte", color: "#dc2626", showMark: false },
            ]}
            height={300}
          />
        </Card>

        <Card variant="outlined" >
          <LineChart
            xAxis={[{ data: anos, scaleType: "point" }]}
            series={[
              { data: dados.map((d) => Number(d.total_inscritos)), label: "Total de candidatos", color: "#2563eb", area: true, showMark: false },
            ]}
            height={300}
          />
        </Card>


        <Card variant="outlined" >
          <BarChart
            xAxis={[{ data: anos, scaleType: "band" }]}
            series={[
              { data: dados.map((d) => Number(d.total_inscritos)), label: "Total de inscritos", color: "#6d97f1" },
            ]}
            height={300}
            borderRadius={10}
          />
        </Card>

        <Card variant="outlined" >
          <BarChart
            xAxis={[{ data: rankingConcorridos.map((d) => String(d.no_curso)), scaleType: "band" }]}
            series={[
              { data: rankingConcorridos.map((d) => Number(d.razao_inscritos_por_vaga)), label: "Razão inscritos/vaga", color: "#6d97f1" },
            ]}
            height={300}
            borderRadius={10}
          />
        </Card>
      </Box>
    </Box>
  );
}
