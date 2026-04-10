"use client";

import { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import CircularProgress from "@mui/material/CircularProgress";
import { CardContent, Divider, Tooltip, useTheme } from "@mui/material";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import { useCandidatosCursos } from "@/src/hooks";
import { useCampusFilter, useYearFilter } from "@/src/features";

const BAR_HEIGHT = 28;
const BAR_GAP = 10;
const STEP = BAR_HEIGHT + BAR_GAP;
const LABEL_WIDTH = 200;
const MARGIN = { top: 6, right: 90 };
const EASE = "cubic-bezier(0.4, 0, 0.2, 1)";
const DURATION = "500ms";

const TIERS = [
  { max: 6, color: "#4e9a8f", label: "< 6x",   description: "Baixíssima — menos de 6 candidatos por vaga" },
  { max: 15, color: "#8fbe6e", label: "6-15x",  description: "Baixa — entre 6 e 15 candidatos por vaga" },
  { max: 30, color: "#D5B071", label: "15-30x", description: "Moderada — entre 15 e 30 candidatos por vaga" },
  { max: 60, color: "#e07b39", label: "30-60x", description: "Alta — entre 30 e 60 candidatos por vaga" },
  { max: Infinity, color: "#c0392b", label: "> 60x",  description: "Muito alta — mais de 60 candidatos por vaga" },
];

function getConcorrenciaColor(ratio: number) {
  return TIERS.find((t) => ratio < t.max)?.color ?? TIERS[TIERS.length - 1].color;
}

function truncate(text: string, max: number) {
  return text.length > max ? text.slice(0, max) + "…" : text;
}

type HoveredItem = {
  curso: string;
  candidatos: number;
  aprovados: number;
  concorrencia: number | null;
  x: number;
  y: number;
};

export function CandidatosBarChart() {
  const theme = useTheme();
  const { anosSelecionados } = useYearFilter();
  const { campusSelecionado } = useCampusFilter();
  const { data, isLoading } = useCandidatosCursos();
  const containerRef = useRef<HTMLDivElement>(null);
  const [width, setWidth] = useState(800);
  const [hovered, setHovered] = useState<HoveredItem | null>(null);

  const rowRefs = useRef<Record<string, SVGGElement | null>>({});
  const prevY = useRef<Record<string, number>>({});

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const ro = new ResizeObserver(([entry]) => setWidth(entry.contentRect.width));
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const dataset = useMemo(() => {
    if (!data) return [];



    const filteredData = data.filter((d) => anosSelecionados.includes(d.ano) && d.campus === campusSelecionado);

    const aggregate = filteredData.reduce<Record<string, { curso: string; candidatos: number; aprovados: number }>>((acc, d) => {
      acc[d.no_curso] ??= { curso: d.no_curso, candidatos: 0, aprovados: 0 };
        acc[d.no_curso].candidatos += d.total_candidatos;
        acc[d.no_curso].aprovados += d.aprovados;
        return acc;
    }, {})

    return Object.values(aggregate)
      .map((d) => ({
        ...d,
        concorrencia: d.aprovados > 0
          ? parseFloat((d.candidatos / d.aprovados).toFixed(1))
          : null,
      }))
      .sort((a, b) => b.candidatos - a.candidatos);
  }, [data, anosSelecionados, campusSelecionado]);

  useLayoutEffect(() => {
    dataset.forEach((d, i) => {
      const el = rowRefs.current[d.curso];
      if (!el) return;
      const newY = i * STEP;
      const oldY = prevY.current[d.curso];

      if (oldY !== undefined && oldY !== newY) {
        el.style.transition = "none";
        el.style.transform = `translateY(${oldY}px)`;
        el.getBoundingClientRect();
        el.style.transition = `transform ${DURATION} ${EASE}`;
        el.style.transform = `translateY(${newY}px)`;
      } else {
        el.style.transform = `translateY(${newY}px)`;
      }

      prevY.current[d.curso] = newY;
    });
  }, [dataset]);

  if (isLoading || !data) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height={300}>
        <CircularProgress />
      </Box>
    );
  }

  const maxVal = Math.max(...dataset.map((d) => d.candidatos), 1);
  const innerWidth = width - LABEL_WIDTH - MARGIN.right;
  const svgHeight = dataset.length * STEP + MARGIN.top;
  const fgOpacity = theme.palette.mode === "dark" ? 0.05 : 0.08;

  return (
    <Box width="100%" sx={{ position: "relative" }}>
      <CardContent>
        <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 2 }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <Typography fontWeight={600}>Inscritos e concorrência por curso</Typography>
            <Tooltip
              title="Concorrência = total de inscritos ÷ vagas preenchidas no curso. Calculado com base nos anos selecionados."
              arrow
              placement="right"
            >
              <InfoOutlinedIcon sx={{ fontSize: 16, color: "text.disabled", cursor: "help" }} />
            </Tooltip>
          </Box>
          <Box sx={{ display: "flex", gap: 2 }}>
            {TIERS.map((tier) => (
              <Tooltip key={tier.label} title={tier.description} arrow placement="top">
                <Box sx={{ display: "flex", alignItems: "center", gap: 0.5, cursor: "help" }}>
                  <Box sx={{ width: 10, height: 10, borderRadius: "2px", bgcolor: tier.color }} />
                  <Typography variant="caption" color="text.secondary">{tier.label}</Typography>
                </Box>
              </Tooltip>
            ))}
          </Box>
        </Box>

        <Box
          sx={{
            maxHeight: 500,
            overflowY: "auto",
            overflowX: "hidden",
            "&::-webkit-scrollbar": { width: 6 },
            "&::-webkit-scrollbar-thumb": { borderRadius: 3, bgcolor: "divider" },
          }}
        >
          <div ref={containerRef} style={{ width: "100%" }}>
            <svg width={width} height={svgHeight} style={{ display: "block", overflow: "visible" }}>
              <g transform={`translate(${LABEL_WIDTH}, ${MARGIN.top})`}>
                {dataset.map((d) => {
                  const ratio = d.candidatos / maxVal;
                  const barWidth = ratio * innerWidth;
                  const color = getConcorrenciaColor(d.concorrencia ?? 0);

                  return (
                    <g
                      key={d.curso}
                      ref={(el) => { rowRefs.current[d.curso] = el; }}
                      style={{ willChange: "transform", cursor: "pointer" }}
                      onMouseMove={(e) => {
                        setHovered({
                          curso: d.curso,
                          candidatos: d.candidatos,
                          aprovados: d.aprovados,
                          concorrencia: d.concorrencia,
                          x: e.clientX,
                          y: e.clientY,
                        });
                      }}
                      onMouseLeave={() => setHovered(null)}
                    >
                      <rect
                        x={0}
                        y={0}
                        width={innerWidth}
                        height={BAR_HEIGHT}
                        fill="currentColor"
                        opacity={fgOpacity}
                        rx={3}
                      />

                      <g
                        style={{
                          transform: `scaleX(${ratio})`,
                          transformOrigin: "0px 0px",
                          transition: `transform ${DURATION} ${EASE}`,
                        }}
                      >
                        <rect x={0} y={0} width={innerWidth} height={BAR_HEIGHT} fill={color} rx={3} />
                      </g>

                      <text
                        x={8}
                        y={BAR_HEIGHT / 2}
                        dominantBaseline="central"
                        fill="white"
                        fontWeight={600}
                        fontSize={11}
                        style={{ pointerEvents: "none" }}
                      >
                        {d.candidatos.toLocaleString("pt-BR")}
                      </text>

                      <g
                        style={{
                          transform: `translateX(${barWidth}px)`,
                          transition: `transform ${DURATION} ${EASE}`,
                        }}
                      >
                        <text
                          x={8}
                          y={BAR_HEIGHT / 2}
                          dominantBaseline="central"
                          fill="currentColor"
                          fontSize={11}
                          opacity={0.6}
                          style={{ pointerEvents: "none" }}
                        >
                          {d.concorrencia != null ? `${d.concorrencia}×` : "—"}
                        </text>
                      </g>

                      <text
                        x={-8}
                        y={BAR_HEIGHT / 2}
                        textAnchor="end"
                        dominantBaseline="central"
                        fontSize={12}
                        fill="currentColor"
                        style={{ pointerEvents: "none" }}
                      >
                        {truncate(d.curso, 26)}
                      </text>
                    </g>
                  );
                })}
              </g>
            </svg>
          </div>
        </Box>
      </CardContent>

      {hovered && createPortal(
        <Box
          sx={{
            position: "fixed",
            top: hovered.y + 12,
            left: hovered.x + 12,
            zIndex: 9999,
            pointerEvents: "none",
            bgcolor: "background.paper",
            border: 1,
            borderColor: "divider",
            borderRadius: 2,
            p: 1.5,
            minWidth: 200,
            boxShadow: "0 4px 16px rgba(0,0,0,0.12)",
          }}
        >
          <Typography variant="caption" fontWeight={600} display="block" mb={1}>
            {hovered.curso}
          </Typography>
          <Divider sx={{ mb: 1 }} />
          {[
            { label: "Inscritos", value: hovered.candidatos.toLocaleString("pt-BR") },
            { label: "Aprovados", value: hovered.aprovados.toLocaleString("pt-BR") },
            {
              label: "Taxa de aprovação",
              value: hovered.candidatos > 0
                ? `${((hovered.aprovados / hovered.candidatos) * 100).toFixed(1)}%`
                : "—",
            },
            {
              label: "Concorrência",
              value: hovered.concorrencia != null ? `${hovered.concorrencia}×` : "—",
            },
          ].map(({ label, value }) => (
            <Box key={label} sx={{ display: "flex", justifyContent: "space-between", gap: 3 }}>
              <Typography variant="caption" color="text.secondary">{label}</Typography>
              <Typography variant="caption" fontWeight={500}>{value}</Typography>
            </Box>
          ))}
        </Box>,
        document.body
      )}
    </Box>
  );
}
