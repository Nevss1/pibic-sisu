"use client";

import { calcularMedia, calcularTotalCandidatos } from "@/src/utils";
import { useEffect } from "react";
import { Box, Grid, Typography, Card } from "@mui/material";
import { LineChart, BarChart } from "@mui/x-charts";
import { useDashboard } from "@/src/hooks";

// formulario react hook form

export default function Home() {
  const {
    dados,
    buscarDadosTotal,
    rankingConcorridos,
    buscarRankingConcorridos,
  } = useDashboard();

  useEffect(() => {
    buscarDadosTotal();
    buscarRankingConcorridos();
  }, []);

  // criar um hook com memo pra calcular esses valores
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
    <Box sx={{ minHeight: "100vh", bgcolor: "white", borderRadius: 2 }}>
      <Typography variant="h4" mb={3} color="text.primary">
        Panorama geral
      </Typography>

      <Card
        sx={{ borderRadius: 2, bgcolor: "white", mb: 4 }}
        variant="outlined"
      >
        <Grid container>
          {cards.map((card, index) => (
            <Grid
              size={{ xs: 12, md: 3 }}
              key={card.label}
              // sx={{
              //   borderRight: { xs: 0, md: index < cards.length - 1 ? 1 : 0 },
              //   borderBottom: { xs: index < cards.length - 1 ? 1 : 0, md: 0 },
              // }}
            >
              <Card
                variant="outlined"
                sx={{ height: 100, p: 2, borderRadius: 0, border: 0 }}
              >
                <Typography
                  variant="body2"
                  sx={{
                    fontFamily: "var(--font-archivo), sans-serif",
                    fontWeight: 500,
                  }}
                >
                  {card.label}
                </Typography>
                <Typography
                  variant="h6"
                  sx={{ fontFamily: "var(--font-archivo), sans-serif" }}
                >
                  {card.value}
                </Typography>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Card>

      <Box sx={{ p: 4, display: "flex", flexDirection: "column", gap: 4 }}>
        <Card variant="outlined">
          <LineChart
            xAxis={[{ data: anos, scaleType: "point" }]}
            series={[
              {
                data: dados.map((d) => d.media_nota_candidato),
                label: "Nota Média do Candidato",
                color: "#2563eb",
                showMark: false,
              },
              {
                data: dados.map((d) => d.media_nota_corte),
                label: "Nota de Corte",
                color: "#dc2626",
                showMark: false,
              },
            ]}
            height={300}
          />
        </Card>

        <Card variant="outlined">
          <LineChart
            xAxis={[{ data: anos, scaleType: "point" }]}
            series={[
              {
                data: dados.map((d) => Number(d.total_inscritos)),
                label: "Total de candidatos",
                color: "#2563eb",
                area: true,
                showMark: false,
              },
            ]}
            height={300}
          />
        </Card>

        <Card variant="outlined">
          <BarChart
            xAxis={[{ data: anos, scaleType: "band" }]}
            series={[
              {
                data: dados.map((d) => Number(d.total_inscritos)),
                label: "Total de inscritos",
                color: "#6d97f1",
              },
            ]}
            height={300}
            borderRadius={10}
          />
        </Card>

        <Card variant="outlined">
          <BarChart
            xAxis={[
              {
                data: rankingConcorridos.map((d) => String(d.no_curso)),
                scaleType: "band",
              },
            ]}
            series={[
              {
                data: rankingConcorridos.map((d) =>
                  Number(d.razao_inscritos_por_vaga),
                ),
                label: "Razão inscritos/vaga",
                color: "#6d97f1",
              },
            ]}
            height={300}
            borderRadius={10}
          />
        </Card>
      </Box>
    </Box>
  );
}
