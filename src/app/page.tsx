"use client";

import { motion, useMotionValue, useSpring } from "framer-motion";
import { Autocomplete, TextField } from "@mui/material";
import { useNomeCursos } from "@/src/hooks";
import { useRouter } from "next/navigation";
import { toTitleCase } from "../utils";
import { useEffect, useRef } from "react";

export default function HomePage() {
  const { data: cursos = [] } = useNomeCursos();
  const router = useRouter();

  const spotlightRef = useRef<HTMLDivElement>(null);
  const mouseX = useMotionValue(typeof window !== "undefined" ? window.innerWidth / 2 : 0);
  const mouseY = useMotionValue(typeof window !== "undefined" ? window.innerHeight / 2 : 0);
  const springX = useSpring(mouseX, { stiffness: 80, damping: 25 });
  const springY = useSpring(mouseY, { stiffness: 80, damping: 25 });

  useEffect(() => {
    const update = () => {
      if (!spotlightRef.current) return;
      spotlightRef.current.style.background = `radial-gradient(700px circle at ${springX.get()}px ${springY.get()}px, rgba(213,176,113,0.15), transparent 70%)`;
    };
    update(); // render inicial no centro
    const unsubX = springX.on("change", update);
    const unsubY = springY.on("change", update);
    return () => { unsubX(); unsubY(); };
  }, [springX, springY]);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [mouseX, mouseY]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center overflow-hidden relative" style={{ backgroundColor: "#0d0b08" }}>
      <div ref={spotlightRef} className="absolute inset-0 pointer-events-none transition-none" />

      {/* Grid de fundo sutil */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.04]"
        style={{
          backgroundImage: `linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)`,
          backgroundSize: "48px 48px",
        }}
      />

      <motion.img
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6 }}
        src="/ufma-logo.png"
        alt="UFMA Logo"
        className="mb-6 size-28 relative z-10"
      />

      <motion.h1
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.2 }}
        className="text-3xl md:text-5xl font-bold text-white mb-4 text-center relative z-10 px-4"
      >
        SISU UFMA {" "}
        <span style={{ color: "#D5B071" }}>Dashboard Analítico</span>
      </motion.h1>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6, duration: 0.8 }}
        className="text-base text-slate-400 mb-10 text-center max-w-lg relative z-10 px-6"
      >
        Explore séries históricas, notas de corte, distribuições estatísticas e
        indicadores completos dos cursos da UFMA no SISU.
      </motion.p>

      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 1, duration: 0.4 }}
        className="relative z-10 w-full px-6 flex justify-center"
      >
        <Autocomplete
          disablePortal
          options={cursos.map((c: { no_curso: string }) =>
            toTitleCase(c.no_curso)
          )}
          onChange={(_, value) => {
            if (value)
              router.push(`/cursos/${encodeURIComponent((value as string).toLowerCase())}`);
          }}
          slotProps={{
            paper: {
              sx: {
                backgroundColor: "#1a1510",
                border: "1px solid rgba(213,176,113,0.2)",
                "& .MuiAutocomplete-option": {
                  color: "rgba(255,255,255,0.75)",
                  '&[aria-selected="true"]': {
                    backgroundColor: "rgba(213,176,113,0.15) !important",
                    color: "#D5B071",
                  },
                  '&.Mui-focused': {
                    backgroundColor: "rgba(213,176,113,0.08) !important",
                  },
                },
              },
            },
          }}
          sx={{
            width: "min(320px, 100%)",
            "& .MuiOutlinedInput-root": {
              color: "white",
              "& fieldset": { borderColor: "rgba(213,176,113,0.4)" },
              "&:hover fieldset": { borderColor: "rgba(213,176,113,0.7)" },
              "&.Mui-focused fieldset": { borderColor: "#D5B071" },
            },
            "& .MuiInputLabel-root": { color: "rgba(148,163,184,0.8)" },
            "& .MuiInputLabel-root.Mui-focused": { color: "#D5B071" },
            "& .MuiSvgIcon-root": { color: "rgba(148,163,184,0.6)" },
          }}
          renderInput={(params) => (
            <TextField {...params} label="Digite seu curso" />
          )}
        />
      </motion.div>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.3 }}
        transition={{ delay: 1.4, duration: 1 }}
        className="mt-12 text-xs text-slate-500 relative z-10"
      >
        Trabalho de Iniciação Científica - Rafael Neves - PIBIC/CNPq 2025/2026
      </motion.p>
    </div>
  );
}
