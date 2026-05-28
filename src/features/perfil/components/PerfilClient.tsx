"use client";

import {
  Box,
  Button,
  CircularProgress,
  Divider,
  Drawer,
  List,
  ListItemButton,
  ListItemText,
  Popover,
  TextField,
  Typography,
  Alert,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import { Fragment, useEffect, useMemo, useRef, useState } from "react";
import type { MouseEvent as ReactMouseEvent } from "react";
import { dashboardGlassCardSx, dashboardMetricCardSx } from "@/src/config/dashboardStyles";
import { PerfilTemporalChart } from "./PerfilTemporalChart";

type Opcoes = {
  campuses: string[];
  turnos: string[];
  graus: string[];
  modalidades: string[];
};

export type AnoRow = {
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

type SelectOption = { label: string; value: string };

// ─── Componente reutilizável de seleção ──────────────────────────────────────

function PerfilSelectField({
  label,
  value,
  placeholder,
  options,
  disabled = false,
  searchable = false,
  onChange,
}: {
  label: string;
  value: string;
  placeholder?: string;
  options: SelectOption[];
  disabled?: boolean;
  searchable?: boolean;
  onChange: (value: string) => void;
}) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("tabletSmall"), { noSsr: true });
  const [anchor, setAnchor] = useState<HTMLElement | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [search, setSearch] = useState("");
  const searchRef = useRef<HTMLInputElement>(null);

  const isOpen = Boolean(anchor) || drawerOpen;

  const filteredOptions = useMemo(() => {
    if (!searchable || !search.trim()) return options;
    const q = search.trim().toLowerCase();
    return options.filter((o) => o.label.toLowerCase().includes(q));
  }, [options, search, searchable]);

  const handleOpen = (e: ReactMouseEvent<HTMLButtonElement>) => {
    if (disabled) return;
    if (isMobile) {
      setDrawerOpen(true);
    } else {
      setAnchor(e.currentTarget);
    }
    if (searchable) {
      setTimeout(() => searchRef.current?.focus(), 80);
    }
  };

  const handleClose = () => {
    setAnchor(null);
    setDrawerOpen(false);
    setSearch("");
  };

  const handleSelect = (val: string) => {
    onChange(val);
    handleClose();
  };

  const displayLabel = value
    ? (options.find((o) => o.value === value)?.label ?? value)
    : (placeholder ?? `Selecionar ${label.toLowerCase()}`);

  const selectorContent = (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        width: { xs: "100%", tabletSmall: searchable ? 400 : 300 },
        maxWidth: "calc(100vw - 32px)",
        maxHeight: { xs: "min(72dvh, 520px)", tabletSmall: searchable ? 440 : 320 },
        p: 2,
        pb: { xs: "calc(16px + env(safe-area-inset-bottom))", tabletSmall: 2 },
        boxSizing: "border-box",
      }}
    >
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 2,
          mb: 1.5,
          flexShrink: 0,
        }}
      >
        <Typography variant="subtitle1" sx={{ color: "#1e1b16", fontWeight: 600 }}>
          {label}
        </Typography>
        <Button
          onClick={handleClose}
          sx={{ minWidth: 0, color: "rgba(30,27,22,0.72)", fontSize: 14, textTransform: "none" }}
        >
          Cancelar
        </Button>
      </Box>

      {searchable && (
        <TextField
          inputRef={searchRef}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Buscar..."
          fullWidth
          size="small"
          sx={{
            mb: 1.5,
            flexShrink: 0,
            "& .MuiInputBase-input": { fontSize: 16 },
            "& .MuiOutlinedInput-root": {
              color: "#1e1b16",
              backgroundColor: "#fff",
              "& fieldset": { borderColor: "rgba(213,176,113,0.45)" },
              "&:hover fieldset": { borderColor: "rgba(213,176,113,0.7)" },
              "&.Mui-focused fieldset": { borderColor: "#D5B071" },
            },
          }}
        />
      )}

      <List sx={{ flex: 1, minHeight: 0, overflowY: "auto", overflowX: "hidden", px: 0, py: 0.5 }}>
        {filteredOptions.length === 0 ? (
          <Typography sx={{ px: 1.5, py: 2, color: "rgba(30,27,22,0.58)", fontSize: 14 }}>
            Nenhuma opção encontrada.
          </Typography>
        ) : (
          filteredOptions.map((opt) => (
            <ListItemButton
              key={opt.value}
              selected={opt.value === value}
              onClick={() => handleSelect(opt.value)}
              sx={{
                minHeight: 44,
                borderRadius: 2,
                px: 1.5,
                py: 0.9,
                mb: 0.25,
                "&.Mui-selected": {
                  backgroundColor: "rgba(213,176,113,0.15)",
                  "&:hover": { backgroundColor: "rgba(213,176,113,0.2)" },
                },
                "&:hover": { backgroundColor: "rgba(213,176,113,0.08)" },
              }}
            >
              <ListItemText
                primary={opt.label}
                slotProps={{
                  primary: {
                    sx: {
                      color: opt.value === value ? "#8a6e3a" : "rgba(30,27,22,0.82)",
                      fontSize: 14,
                      lineHeight: 1.35,
                      whiteSpace: "normal",
                      overflowWrap: "anywhere",
                      fontWeight: opt.value === value ? 600 : 400,
                    },
                  },
                }}
              />
            </ListItemButton>
          ))
        )}
      </List>
    </Box>
  );

  return (
    <Box sx={{ minWidth: 0 }}>
      <Typography
        component="span"
        sx={{
          fontSize: "0.68rem",
          fontWeight: 700,
          color: disabled ? "rgba(122,96,64,0.38)" : "#7A6A58",
          letterSpacing: "0.06em",
          textTransform: "uppercase",
          display: "block",
          mb: 0.75,
        }}
      >
        {label}
      </Typography>

      <Button
        variant="outlined"
        fullWidth
        disabled={disabled}
        onClick={handleOpen}
        aria-haspopup="dialog"
        aria-expanded={isOpen}
        aria-label={label}
        endIcon={
          <KeyboardArrowDownIcon
            sx={{
              color: disabled ? "rgba(122,96,64,0.25)" : "rgba(100,116,139,0.75)",
              transform: isOpen ? "rotate(180deg)" : "rotate(0deg)",
              transition: "transform 0.18s ease",
              flexShrink: 0,
            }}
          />
        }
        sx={{
          justifyContent: "space-between",
          minHeight: 44,
          px: 1.75,
          color: value ? "#1e1b16" : "rgba(100,116,139,0.9)",
          backgroundColor: "rgba(255,252,248,0.76)",
          borderColor: isOpen ? "#D5A642" : "rgba(174,143,88,0.28)",
          borderRadius: "12px",
          fontSize: 14,
          textAlign: "left",
          textTransform: "none",
          fontWeight: value ? 500 : 400,
          "&:hover": {
            borderColor: "rgba(174,143,88,0.5)",
            backgroundColor: "rgba(213,176,113,0.06)",
          },
          "&.Mui-disabled": {
            color: "rgba(122,96,64,0.38)",
            backgroundColor: "rgba(255,252,248,0.4)",
            borderColor: "rgba(174,143,88,0.08)",
          },
          "& .MuiButton-endIcon": { ml: "auto", mr: 0 },
        }}
      >
        <Box
          component="span"
          sx={{
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
            flex: 1,
            textAlign: "left",
          }}
        >
          {displayLabel}
        </Box>
      </Button>

      {/* Desktop: Popover */}
      <Popover
        open={Boolean(anchor)}
        anchorEl={anchor}
        onClose={handleClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
        transformOrigin={{ vertical: "top", horizontal: "left" }}
        sx={{ display: { xs: "none", tabletSmall: "block" } }}
        slotProps={{
          paper: {
            sx: {
              mt: 1,
              borderRadius: 2,
              backgroundColor: "#FEF9F6",
              border: "1px solid rgba(213,176,113,0.28)",
              boxShadow: "0 18px 50px rgba(30,27,22,0.14)",
              overflow: "hidden",
            },
          },
        }}
      >
        {selectorContent}
      </Popover>

      {/* Mobile: Bottom Drawer */}
      <Drawer
        anchor="bottom"
        open={drawerOpen}
        onClose={handleClose}
        sx={{
          display: { tabletSmall: "none" },
          "& .MuiDrawer-paper": {
            width: "100%",
            maxWidth: "100vw",
            maxHeight: "min(72dvh, 520px)",
            borderTopLeftRadius: 18,
            borderTopRightRadius: 18,
            backgroundColor: "#FEF9F6",
            overflow: "hidden",
          },
        }}
      >
        {selectorContent}
      </Drawer>
    </Box>
  );
}

// ─── Tabela de histórico ──────────────────────────────────────────────────────

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
            <Box key={row.ano} sx={{ ...dashboardGlassCardSx, p: 2 }}>
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
                    <Typography variant="body2" sx={{ color: "#7A5420", fontWeight: 700 }}>
                      {value}
                    </Typography>
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
          sx={{ color: "#7A6A58", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.05em" }}
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

// ─── Card de métrica ─────────────────────────────────────────────────────────

function StatBox({ label, value, sub }: { label: string; value: string; sub?: string }) {
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
        <Typography sx={{ fontSize: 12, color: "text.disabled" }}>{sub}</Typography>
      )}
    </Box>
  );
}

// ─── Componente principal ────────────────────────────────────────────────────

const SEXO_OPTIONS: SelectOption[] = [
  { label: "Todos os sexos", value: "" },
  { label: "Masculino", value: "M" },
  { label: "Feminino", value: "F" },
];

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

    const params = new URLSearchParams({ curso: curso!, campus, modalidade, turno, grau, sexo });

    try {
      const res = await fetch(`/api/perfil?${params}`);
      if (!res.ok) throw new Error("Erro na requisição");
      const data: Resultado = await res.json();
      if (!data.resumo || data.rows.length === 0) {
        setErro("Nenhum dado encontrado para esse perfil. Tente ampliar os filtros.");
      } else {
        setResultado(data);
      }
    } catch {
      setErro("Ocorreu um erro ao buscar os dados. Tente novamente.");
    } finally {
      setLoading(false);
    }
  }

  // ─── Opções derivadas ───────────────────────────────────────────────────────

  const cursoOptions = useMemo<SelectOption[]>(
    () => cursos.map((c) => ({ label: c, value: c })),
    [cursos]
  );

  const campusOptions = useMemo<SelectOption[]>(
    () => opcoes.campuses.map((c) => ({ label: c, value: c })),
    [opcoes.campuses]
  );

  const turnoOptions = useMemo<SelectOption[]>(
    () => [{ label: "Qualquer turno", value: "" }, ...opcoes.turnos.map((t) => ({ label: t, value: t }))],
    [opcoes.turnos]
  );

  const grauOptions = useMemo<SelectOption[]>(
    () => [{ label: "Qualquer grau", value: "" }, ...opcoes.graus.map((g) => ({ label: g, value: g }))],
    [opcoes.graus]
  );

  const modalidadeOptions = useMemo<SelectOption[]>(
    () => [{ label: "Todas as modalidades", value: "" }, ...opcoes.modalidades.map((m) => ({ label: m, value: m }))],
    [opcoes.modalidades]
  );

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

        {/* Curso */}
        <PerfilSelectField
          label="Curso"
          value={curso ?? ""}
          placeholder="Selecionar curso"
          options={cursoOptions}
          searchable
          onChange={(v) => setCurso(v || null)}
        />

        {/* Campus */}
        <PerfilSelectField
          label="Campus"
          value={campus}
          placeholder={!curso ? "Selecione um curso primeiro" : "Selecionar campus"}
          options={campusOptions}
          searchable={campusOptions.length > 5}
          disabled={!curso || loadingOpcoes}
          onChange={setCampus}
        />

        <Divider />

        <Typography
          variant="caption"
          sx={{ color: "#7A6A58", fontWeight: 700, letterSpacing: "0.05em", textTransform: "uppercase" }}
        >
          Filtros opcionais
        </Typography>

        <Box sx={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 2 }}>
          <PerfilSelectField
            label="Turno"
            value={turno}
            options={turnoOptions}
            disabled={!campus}
            onChange={setTurno}
          />
          <PerfilSelectField
            label="Grau"
            value={grau}
            options={grauOptions}
            disabled={!campus}
            onChange={setGrau}
          />
          <PerfilSelectField
            label="Modalidade"
            value={modalidade}
            options={modalidadeOptions}
            disabled={!campus}
            onChange={setModalidade}
          />
          <PerfilSelectField
            label="Sexo"
            value={sexo}
            options={SEXO_OPTIONS}
            onChange={setSexo}
          />
        </Box>

        <Button
          type="submit"
          variant="contained"
          disabled={!curso || !campus || loading}
          sx={{ mt: 1 }}
        >
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
                    rows.reduce((s, r) => s + r.total / r.total_curso, 0) / rows.length;
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

            <Box
              sx={{
                ...dashboardGlassCardSx,
                display: "flex",
                gap: 1.5,
                p: 2.5,
                alignItems: "flex-start",
              }}
            >
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
