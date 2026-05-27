"use client";

import {
  Autocomplete,
  Box,
  Button,
  CircularProgress,
  Divider,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
  Alert,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import { Fragment, useEffect, useState } from "react";
import { dashboardGlassCardSx, dashboardMetricCardSx } from "@/src/config/dashboardStyles";

type Opcoes = {
  campuses: string[];
  turnos: string[];
  graus: string[];
  modalidades: string[];
};

type AnoRow = {
  ano: number;
  total: number;
  aprovados: number;
  nota_corte_media: number | null;
  total_curso: number;
};

type Resultado = {
  rows: AnoRow[];
  resumo: { total: number; aprovados: number; taxa: number } | null;
};

function TabelaHistorico({ rows }: { rows: AnoRow[] }) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("mobile"));

  if (isMobile) {
    return (
      <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
        {rows.map((row) => {
          const taxa = row.total > 0 ? ((row.aprovados / row.total) * 100).toFixed(1) + "%" : "—";
          const participacao = row.total_curso > 0 ? ((row.total / row.total_curso) * 100).toFixed(1) + "%" : "—";
          return (
            <Box
              key={row.ano}
              sx={{ ...dashboardGlassCardSx, p: 2 }}
            >
              <Typography variant="subtitle2" fontWeight={600} mb={1}>
                {row.ano}
              </Typography>
              <Box sx={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 1 }}>
                {[
                  { label: "Candidatos",    value: row.total.toLocaleString("pt-BR") },
                  { label: "Aprovados",     value: row.aprovados.toLocaleString("pt-BR") },
                  { label: "Taxa aprov.",   value: taxa },
                  { label: "Participação",  value: participacao },
                  { label: "Nota de corte", value: row.nota_corte_media?.toFixed(2) ?? "—" },
                ].map(({ label, value }) => (
                  <Box key={label}>
                    <Typography
                      variant="caption"
                      sx={{
                        color: "#7A6A58",
                        fontWeight: 700,
                        textTransform: "uppercase",
                        letterSpacing: "0.05em",
                        fontSize: "0.625rem",
                      }}
                    >
                      {label}
                    </Typography>
                    <Typography variant="body2" sx={{ color: "#7A5420", fontWeight: 700 }}>{value}</Typography>
                  </Box>
                ))}
              </Box>
            </Box>
          );
        })}
      </Box>
    );
  }

  return (
    <Box
      sx={{
        display: "grid",
        gridTemplateColumns: "auto 1fr 1fr 1fr 1fr 1fr",
        columnGap: 4,
        rowGap: 1,
        alignItems: "center",
        overflowX: "auto",
      }}
    >
      {["Ano", "Candidatos", "Aprovados", "Taxa aprov.", "Participação", "Nota de corte"].map((h) => (
        <Typography
          key={h}
          variant="caption"
          sx={{
            color: "#7A6A58",
            fontWeight: 700,
            textTransform: "uppercase",
            letterSpacing: "0.05em",
          }}
        >
          {h}
        </Typography>
      ))}
      {rows.map((row) => {
        const taxa = row.total > 0 ? ((row.aprovados / row.total) * 100).toFixed(1) + "%" : "—";
        const participacao = row.total_curso > 0 ? ((row.total / row.total_curso) * 100).toFixed(1) + "%" : "—";
        return (
          <Fragment key={row.ano}>
            <Typography variant="body2" sx={{ color: "#7A5420", fontWeight: 700 }}>{row.ano}</Typography>
            <Typography variant="body2" color="text.secondary">{row.total.toLocaleString("pt-BR")}</Typography>
            <Typography variant="body2" color="text.secondary">{row.aprovados.toLocaleString("pt-BR")}</Typography>
            <Typography variant="body2" color="text.secondary">{taxa}</Typography>
            <Typography variant="body2" color="text.secondary">{participacao}</Typography>
            <Typography variant="body2" color="text.secondary">{row.nota_corte_media?.toFixed(2) ?? "—"}</Typography>
          </Fragment>
        );
      })}
    </Box>
  );
}

function StatBox({
  label,
  value,
  sub,
}: {
  label: string;
  value: string;
  sub?: string;
}) {
  return (
    <Box
      sx={{
        ...dashboardMetricCardSx,
        p: 3,
        display: "flex",
        flexDirection: "column",
        gap: 0.5,
      }}
    >
      <Typography
        sx={{
          fontSize: 13,
          color: "#7A6A58",
          fontWeight: 700,
          letterSpacing: "0.06em",
          textTransform: "uppercase",
        }}
      >
        {label}
      </Typography>
      <Typography
        sx={{
          fontSize: 28,
          fontWeight: 700,
          color: "#7A5420",
          fontFamily: "var(--font-archivo), sans-serif",
          lineHeight: 1,
        }}
      >
        {value}
      </Typography>
      {sub && (
        <Typography sx={{ fontSize: 12, color: "text.disabled" }}>
          {sub}
        </Typography>
      )}
    </Box>
  );
}

export function PerfilClient() {
  const [cursos, setCursos] = useState<string[]>([]);
  const [opcoes, setOpcoes] = useState<Opcoes>({ campuses: [], turnos: [], graus: [], modalidades: [] });
  const [loadingOpcoes, setLoadingOpcoes] = useState(false);

  const [curso, setCurso] = useState<string | null>(null);
  const [campus, setCampus] = useState("");
  const [modalidade, setModalidade] = useState("");
  const [turno, setTurno] = useState("");
  const [grau, setGrau] = useState("");
  const [sexo, setSexo] = useState("");

  const [loading, setLoading] = useState(false);
  const [resultado, setResultado] = useState<Resultado | null>(null);
  const [erro, setErro] = useState("");

  useEffect(() => {
    fetch("/api/cursos")
      .then((r) => r.json())
      .then((data: { no_curso: string }[]) => setCursos(data.map((d) => d.no_curso)));
  }, []);

  useEffect(() => {
    if (!curso) {
      setOpcoes({ campuses: [], turnos: [], graus: [], modalidades: [] });
      return;
    }
    setCampus("");
    setModalidade("");
    setTurno("");
    setGrau("");
    setResultado(null);
    setErro("");
    setLoadingOpcoes(true);
    fetch(`/api/perfil/opcoes?curso=${encodeURIComponent(curso)}`)
      .then((r) => r.json())
      .then((data: Opcoes) => setOpcoes(data))
      .finally(() => setLoadingOpcoes(false));
  }, [curso]);

  // Quando campus muda → busca turno/grau/modalidade para curso+campus
  useEffect(() => {
    if (!curso || !campus) return;
    setModalidade("");
    setTurno("");
    setGrau("");
    setResultado(null);
    setErro("");
    fetch(`/api/perfil/opcoes?curso=${encodeURIComponent(curso)}&campus=${encodeURIComponent(campus)}`)
      .then((r) => r.json())
      .then((data: Opcoes) =>
        setOpcoes((prev) => ({ ...prev, turnos: data.turnos, graus: data.graus, modalidades: data.modalidades }))
      );
  }, [campus]); // eslint-disable-line react-hooks/exhaustive-deps

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!curso || !campus) return;

    setLoading(true);
    setErro("");
    setResultado(null);

    const params = new URLSearchParams({
      curso,
      campus,
      modalidade,
      turno,
      grau,
      sexo,
    });

    try {
      const res = await fetch(`/api/perfil?${params}`);
      console.log(res)
      if (!res.ok) throw new Error("Erro na requisição");
      const data: Resultado = await res.json();
      if (!data.resumo || data.rows.length === 0) {
        setErro(
          "Nenhum dado encontrado para esse perfil. Tente ampliar os filtros."
        );
      } else {
        setResultado(data);
      }
    } catch {
      setErro("Ocorreu um erro ao buscar os dados. Tente novamente.");
    } finally {
      setLoading(false);
    }
  }

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
      {/* Formulário */}
      <Box
        component="form"
        onSubmit={handleSubmit}
        sx={{
          display: "flex",
          flexDirection: "column",
          gap: 2.5,
          ...dashboardGlassCardSx,
          p: 3,
          "& .MuiOutlinedInput-root": {
            bgcolor: "rgba(255, 252, 248, 0.76)",
            borderRadius: "12px",
            "& fieldset": { borderColor: "rgba(174, 143, 88, 0.18)" },
            "&:hover fieldset": { borderColor: "rgba(174, 143, 88, 0.32)" },
            "&.Mui-focused fieldset": { borderColor: "#D5A642", borderWidth: 1 },
          },
          "& .MuiInputLabel-root.Mui-focused": {
            color: "#9A6A21",
          },
        }}
      >
        <Box>
          <Typography variant="body1" sx={{ color: "#7A5420", fontWeight: 700 }} gutterBottom>
            Seu perfil
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Preencha as informações para consultar a taxa histórica de aprovação
            no curso desejado.
          </Typography>
        </Box>

        <Divider />

        <Autocomplete
          options={cursos}
          value={curso}
          onChange={(_, v) => setCurso(v)}
          renderInput={(params) => (
            <TextField {...params} label="Curso *" size="small" />
          )}
          size="small"
        />

        <FormControl size="small" required disabled={!curso || loadingOpcoes}>
          <InputLabel>Campus</InputLabel>
          <Select
            value={campus}
            label="Campus"
            onChange={(e) => setCampus(e.target.value)}
          >
            {opcoes.campuses.map((c: string) => (
              <MenuItem key={c} value={c}>{c}</MenuItem>
            ))}
          </Select>
        </FormControl>

        <FormControl size="small" disabled={!campus}>
          <InputLabel>Turno</InputLabel>
          <Select
            value={turno}
            label="Turno"
            onChange={(e) => setTurno(e.target.value)}
          >
            <MenuItem value="">Todos</MenuItem>
            {opcoes.turnos.map((t: string) => (
              <MenuItem key={t} value={t}>{t}</MenuItem>
            ))}
          </Select>
        </FormControl>

        <FormControl size="small" disabled={!campus}>
          <InputLabel>Grau</InputLabel>
          <Select
            value={grau}
            label="Grau"
            onChange={(e) => setGrau(e.target.value)}
          >
            <MenuItem value="">Todos</MenuItem>
            {opcoes.graus.map((g: string) => (
              <MenuItem key={g} value={g}>{g}</MenuItem>
            ))}
          </Select>
        </FormControl>

        <FormControl size="small" disabled={!campus}>
          <InputLabel>Modalidade de concorrência</InputLabel>
          <Select
            value={modalidade}
            label="Modalidade de concorrência"
            onChange={(e) => setModalidade(e.target.value)}
          >
            <MenuItem value="">Todas</MenuItem>
            {opcoes.modalidades.map((m: string) => (
              <MenuItem key={m} value={m}>{m}</MenuItem>
            ))}
          </Select>
        </FormControl>

        <FormControl size="small">
          <InputLabel>Sexo</InputLabel>
          <Select
            value={sexo}
            label="Sexo"
            onChange={(e) => setSexo(e.target.value)}
          >
            <MenuItem value="">Todos</MenuItem>
            <MenuItem value="M">Masculino</MenuItem>
            <MenuItem value="F">Feminino</MenuItem>
          </Select>
        </FormControl>

        <Button
          type="submit"
          variant="contained"
          disabled={!curso || !campus || loading}
          sx={{ mt: 1 }}
        >
          {loading ? (
            <CircularProgress size={18} color="inherit" />
          ) : (
            "Consultar"
          )}
        </Button>
      </Box>

      {/* Resultados */}
      <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
        {!temResultado && !erro && !loading && (
          <Box
            sx={{
              ...dashboardGlassCardSx,
              p: 6,
              textAlign: "center",
              color: "text.disabled",
            }}
          >
            <Typography variant="body2">
              Preencha o formulário e clique em Consultar para ver os
              resultados.
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
            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: { xs: "1fr", mobile: "repeat(2, 1fr)" },
                gap: 2,
              }}
            >
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
                  const media =
                    rows.reduce((s, r) => s + r.total / r.total_curso, 0) /
                    rows.length;
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

            {/* Tabela por ano */}
            <Box
              sx={{
                ...dashboardGlassCardSx,
                p: 3,
              }}
            >
              <Typography
                variant="body2"
                fontWeight={700}
                color="#7A5420"
                mb={2}
              >
                Histórico por ano
              </Typography>
              <TabelaHistorico rows={resultado.rows} />
            </Box>

            {/* Aviso */}
            <Box
              sx={{
                ...dashboardGlassCardSx,
                display: "flex",
                gap: 1.5,
                p: 2.5,
                alignItems: "flex-start",
              }}
            >
              <InfoOutlinedIcon
                sx={{ fontSize: 18, color: "text.secondary", mt: 0.25 }}
              />
              <Typography variant="body2" color="text.secondary">
                Esta taxa reflete a <strong>concorrência histórica</strong> do
                perfil selecionado — não é uma previsão de aprovação individual.
                O fator decisivo no SISU é a nota do ENEM. Use esses dados para
                entender o nível de disputado do curso e da modalidade.
              </Typography>
            </Box>
          </>
        )}
      </Box>
    </Box>
  );
}
