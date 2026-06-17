"use client";

import { Alert, Box, Button, CircularProgress, Divider, Typography } from "@mui/material";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import { dashboardGlassCardSx } from "@/src/config/dashboardStyles";
import { usePerfilForm } from "../hooks/usePerfilForm";
import type { SelectOption } from "../perfil.types";
import { PerfilSelectField } from "./PerfilSelectField";
import { PerfilTemporalChart } from "./PerfilTemporalChart";
import { StatBox } from "./StatBox";
import { TabelaHistorico } from "./TabelaHistorico";

const SEXO_OPTIONS: SelectOption[] = [
  { label: "Todos os sexos", value: "" },
  { label: "Masculino", value: "M" },
  { label: "Feminino", value: "F" },
];

export function PerfilClient() {
  const {
    curso,
    campus,
    modalidade, setModalidade,
    turno, setTurno,
    grau, setGrau,
    sexo, setSexo,
    loading, loadingOpcoes,
    resultado, erro,
    handleCursoChange,
    handleCampusChange,
    handleSubmit,
    cursoOptions, campusOptions, turnoOptions, grauOptions, modalidadeOptions,
  } = usePerfilForm();

  const temResultado = resultado && resultado.resumo;

  return (
    <Box
      sx={{
        display: "grid",
        gridTemplateColumns: { mobile: "1fr", tablet: "380px 1fr" },
        gap: 4,
        paddingBottom: 50,
        alignItems: "start",
      }}
    >
      {/* ── Formulário ── */}
      <Box
        component="form"
        onSubmit={handleSubmit}
        sx={{
          display: "flex",
          flexDirection: "column",
          gap: 2,
          ...dashboardGlassCardSx,
          p: 3,
          overflow: "hidden",
        }}
      >
        <Box>
          <Typography variant="body1" sx={{ color: "#7A5420", fontWeight: 700 }} gutterBottom>
            Seu perfil
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Preencha as informações para consultar a taxa histórica de aprovação no curso desejado.
          </Typography>
        </Box>

        <Divider />

        <PerfilSelectField
          label="Curso"
          value={curso ?? ""}
          placeholder="Selecionar curso"
          options={cursoOptions}
          searchable
          onChange={(v) => handleCursoChange(v || null)}
        />

        <PerfilSelectField
          label="Campus"
          value={campus}
          placeholder={!curso ? "Selecione um curso primeiro" : "Selecionar campus"}
          options={campusOptions}
          searchable={campusOptions.length > 5}
          disabled={!curso || loadingOpcoes}
          onChange={handleCampusChange}
        />

        <Divider />

        <Typography
          variant="caption"
          sx={{ color: "#7A6A58", fontWeight: 700, letterSpacing: "0.05em", textTransform: "uppercase" }}
        >
          Filtros opcionais
        </Typography>

        <Box sx={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 2 }}>
          <PerfilSelectField label="Turno" value={turno} options={turnoOptions} disabled={!campus} onChange={setTurno} />
          <PerfilSelectField label="Grau" value={grau} options={grauOptions} disabled={!campus} onChange={setGrau} />
          <PerfilSelectField label="Modalidade" value={modalidade} options={modalidadeOptions} disabled={!campus} onChange={setModalidade} />
          <PerfilSelectField label="Sexo" value={sexo} options={SEXO_OPTIONS} onChange={setSexo} />
        </Box>

        <Button type="submit" variant="contained" disabled={!curso || !campus || loading} sx={{ mt: 1 }}>
          {loading ? <CircularProgress size={18} color="inherit" /> : "Consultar"}
        </Button>
      </Box>

      {/* ── Resultados ── */}
      <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
        {!temResultado && !erro && !loading && (
          <Box sx={{ ...dashboardGlassCardSx, p: 6, textAlign: "center", color: "text.disabled" }}>
            <Typography variant="body2">
              Preencha o formulário e clique em Consultar para ver os resultados.
            </Typography>
          </Box>
        )}

        {erro && (
          <Alert severity="warning" sx={{ borderRadius: 2 }}>
            {erro}
          </Alert>
        )}

        {temResultado && (
          <>
            <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", mobile: "repeat(2, 1fr)" }, gap: 2 }}>
              <StatBox
                label="Taxa de aprovação histórica"
                value={`${resultado.resumo!.taxa}%`}
                sub="média entre todos os anos"
              />
              <StatBox
                label="Taxa de participação média"
                value={(() => {
                  const rows = resultado.rows.filter((r) => r.total_curso > 0);
                  if (rows.length === 0) return "—";
                  const media = rows.reduce((s, r) => s + r.total / r.total_curso, 0) / rows.length;
                  return `${(media * 100).toFixed(1)}%`;
                })()}
                sub="candidatos do perfil / total do curso"
              />
              <StatBox
                label="Total de candidatos"
                value={resultado.resumo!.total.toLocaleString("pt-BR")}
                sub="no perfil selecionado"
              />
              <StatBox
                label="Total de aprovados"
                value={resultado.resumo!.aprovados.toLocaleString("pt-BR")}
                sub="chamada regular"
              />
            </Box>

            <Box sx={{ ...dashboardGlassCardSx, p: 3 }}>
              <Typography variant="body2" fontWeight={700} color="#7A5420" mb={2}>
                Histórico por ano
              </Typography>
              <TabelaHistorico rows={resultado.rows} />
            </Box>

            <PerfilTemporalChart rows={resultado.rows} />

            <Box sx={{ ...dashboardGlassCardSx, display: "flex", gap: 1.5, p: 2.5, alignItems: "flex-start" }}>
              <InfoOutlinedIcon sx={{ fontSize: 18, color: "text.secondary", mt: 0.25 }} />
              <Typography variant="body2" color="text.secondary">
                Esta taxa reflete a <strong>concorrência histórica</strong> do perfil selecionado — não é
                uma previsão de aprovação individual. O fator decisivo no SISU é a nota do ENEM. Use esses
                dados para entender o nível de disputado do curso e da modalidade.
              </Typography>
            </Box>
          </>
        )}
      </Box>
    </Box>
  );
}
