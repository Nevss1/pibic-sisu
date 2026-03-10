"use client";

import * as React from "react";
import { useTheme, styled } from "@mui/material/styles";
import Typography from "@mui/material/Typography";
import { BarChart, type BarLabelProps, type BarProps } from "@mui/x-charts/BarChart";
import { useAnimate, useAnimateBar, useDrawingArea } from "@mui/x-charts/hooks";
import { PiecewiseColorLegend } from "@mui/x-charts/ChartsLegend";
import { interpolateObject } from "@mui/x-charts-vendor/d3-interpolate";
import Box from "@mui/material/Box";
import CircularProgress from "@mui/material/CircularProgress";
import { useCandidatosCursos } from "@/src/hooks";

const BAR_HEIGHT = 36;
const BAR_MARGIN = 8;

export default function CandidatosBarChart({ ano }: { ano?: string }) {
  const { data, isLoading } = useCandidatosCursos(ano);

  if (isLoading || !data) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height={300}>
        <CircularProgress />
      </Box>
    );
  }

  const dataset = data.map((d) => ({
    curso: d.no_curso,
    candidatos: d.total_candidatos,
  }));

  const max = Math.max(...dataset.map((d) => d.candidatos));
  const low = Math.round(max * 0.33);
  const high = Math.round(max * 0.66);
  const chartHeight = dataset.length * (BAR_HEIGHT + BAR_MARGIN) + 60;

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
          "&::-webkit-scrollbar-thumb": {
            borderRadius: 3,
            bgcolor: "divider",
          },
        }}
      >
        <BarChart
          height={chartHeight}
          dataset={dataset}
          series={[
            {
              id: "candidatos",
              dataKey: "candidatos",
              valueFormatter: (value: number | null) =>
                value !== null ? value.toLocaleString("pt-BR") : "",
            },
          ]}
          layout="horizontal"
          xAxis={[
            {
              id: "color",
              min: 0,
              colorMap: {
                type: "piecewise",
                thresholds: [low, high],
                colors: ["#f5e6c8", "#D5B071", "#a07a3a"],
              },
              valueFormatter: (value: number) => value.toLocaleString("pt-BR"),
            },
          ]}
          barLabel={(v) =>
            v.value !== null ? v.value.toLocaleString("pt-BR") : ""
          }
          yAxis={[
            {
              scaleType: "band",
              dataKey: "curso",
              width: 180,
            },
          ]}
          slots={{
            legend: PiecewiseColorLegend,
            barLabel: BarLabelAtBase,
            bar: BarShadedBackground,
          }}
          slotProps={{
            legend: {
              axisDirection: "x",
              markType: "square",
              labelPosition: "inline-start",
              labelFormatter: ({ index }: { index: number }) => {
                if (index === 0) return "menos candidatos";
                if (index === 1) return "moderado";
                return "mais candidatos";
              },
            },
          }}
        />
      </Box>
    </Box>
  );
}

function BarShadedBackground(props: BarProps) {
  const { ownerState, skipAnimation, id, dataIndex, xOrigin, yOrigin, ...other } = props;
  const theme = useTheme();
  const animatedProps = useAnimateBar(props);
  const { width } = useDrawingArea();

  return (
    <React.Fragment>
      <rect
        {...other}
        fill={(theme.vars || theme).palette.text.primary}
        opacity={theme.palette.mode === "dark" ? 0.05 : 0.1}
        x={other.x}
        width={width}
      />
      <rect
        {...other}
        filter={ownerState.isHighlighted ? "brightness(120%)" : undefined}
        opacity={ownerState.isFaded ? 0.3 : 1}
        data-highlighted={ownerState.isHighlighted || undefined}
        data-faded={ownerState.isFaded || undefined}
        {...animatedProps}
      />
    </React.Fragment>
  );
}

const StyledText = styled("text")(({ theme }) => ({
  ...theme?.typography?.body2,
  stroke: "none",
  fill: (theme.vars || theme).palette.common.white,
  transition: "opacity 0.2s ease-in, fill 0.2s ease-in",
  textAnchor: "start",
  dominantBaseline: "central",
  pointerEvents: "none",
  fontWeight: 600,
}));

function BarLabelAtBase(props: BarLabelProps) {
  const {
    seriesId,
    dataIndex,
    color,
    isFaded,
    isHighlighted,
    classes,
    xOrigin,
    yOrigin,
    x,
    y,
    width,
    height,
    layout,
    skipAnimation,
    ...otherProps
  } = props;

  const animatedProps = useAnimate(
    { x: xOrigin + 8, y: y + height / 2 },
    {
      initialProps: { x: xOrigin, y: y + height / 2 },
      createInterpolator: interpolateObject,
      transformProps: (p) => p,
      applyProps: (element: SVGTextElement, p) => {
        element.setAttribute("x", p.x.toString());
        element.setAttribute("y", p.y.toString());
      },
      skip: skipAnimation,
    }
  );

  return <StyledText {...otherProps} {...animatedProps} />;
}
