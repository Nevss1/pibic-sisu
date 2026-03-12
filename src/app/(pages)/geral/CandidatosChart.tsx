"use client";

import { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import CircularProgress from "@mui/material/CircularProgress";
import { useCandidatosCursos } from "@/src/hooks";
import { useYearFilter } from "../YearFilterContext";
import { useCampusFilter } from "../CampusFilterContext";

const BAR_HEIGHT = 32;
const BAR_GAP = 8;
const STEP = BAR_HEIGHT + BAR_GAP;
const LABEL_WIDTH = 200;
const MARGIN = { top: 6, right: 80 };
const EASE = "cubic-bezier(0.4, 0, 0.2, 1)";
const DURATION = "500ms";

function getColor(value: number, low: number, high: number) {
  if (value < low) return "#f5e6c8";
  if (value < high) return "#D5B071";
  return "#a07a3a";
}

function truncate(text: string, max: number) {
  return text.length > max ? text.slice(0, max) + "…" : text;
}

export default function CandidatosBarChart() {
  const { anosSelecionados } = useYearFilter();
  const { campusSelecionado } = useCampusFilter();
  const { data, isLoading } = useCandidatosCursos();
  const containerRef = useRef<HTMLDivElement>(null);
  const [width, setWidth] = useState(800);

  // FLIP: refs e posições anteriores por curso
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
    return Object.values(
      data
        .filter((d) => anosSelecionados.includes(d.ano) && d.campus === campusSelecionado)
        .reduce<Record<string, { curso: string; candidatos: number }>>((acc, d) => {
          acc[d.no_curso] ??= { curso: d.no_curso, candidatos: 0 };
          acc[d.no_curso].candidatos += d.total_candidatos;
          return acc;
        }, {})
    ).sort((a, b) => b.candidatos - a.candidatos);
  }, [data, anosSelecionados, campusSelecionado]);

  // FLIP para posição Y: anima tanto subida quanto descida
  useLayoutEffect(() => {
    dataset.forEach((d, i) => {
      const el = rowRefs.current[d.curso];
      if (!el) return;
      const newY = i * STEP;
      const oldY = prevY.current[d.curso];

      if (oldY !== undefined && oldY !== newY) {
        el.style.transition = "none";
        el.style.transform = `translateY(${oldY}px)`;
        el.getBoundingClientRect(); // força reflow
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
  const low = Math.round(maxVal * 0.33);
  const high = Math.round(maxVal * 0.66);
  const innerWidth = width - LABEL_WIDTH - MARGIN.right;
  const svgHeight = dataset.length * STEP + MARGIN.top;

  return (
    <Box width="100%">
      <Typography marginBottom={2} fontWeight={600}>
        Candidatos por curso na UFMA
      </Typography>
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
                const color = getColor(d.candidatos, low, high);
                return (
                  <g
                    key={d.curso}
                    ref={(el) => { rowRefs.current[d.curso] = el; }}
                    style={{ willChange: "transform" }}
                  >
                    {/* Fundo */}
                    <rect x={0} y={0} width={innerWidth} height={BAR_HEIGHT} fill="currentColor" opacity={0.07} rx={2} />

                    {/* Barra animada via scaleX */}
                    <g
                      style={{
                        transform: `scaleX(${ratio})`,
                        transformOrigin: "0px 0px",
                        transition: `transform ${DURATION} ${EASE}`,
                      }}
                    >
                      <rect x={0} y={0} width={innerWidth} height={BAR_HEIGHT} fill={color} rx={2} />
                    </g>

                    {/* Valor animado junto com a barra */}
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
                        fontWeight={600}
                        fontSize={12}
                        style={{ pointerEvents: "none" }}
                      >
                        {d.candidatos.toLocaleString("pt-BR")}
                      </text>
                    </g>

                    {/* Nome do curso */}
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
    </Box>
  );
}
