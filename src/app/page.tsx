"use client";

import { motion, useMotionValue, useSpring } from "framer-motion";
import { Autocomplete, Box, Button, TextField } from "@mui/material";
import { useNomeCursos } from "@/src/hooks";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { toTitleCase } from "../utils";
import { useEffect, useRef, useState } from "react";
import BackgroundParticles from "./BackgroundParticles";

export default function HomePage() {
  const { data: cursos = [] } = useNomeCursos();
  const router = useRouter();

  const [pendingUrl, setPendingUrl] = useState<string | null>(null);
  const spotlightRef = useRef<HTMLDivElement>(null);
  const mouseX = useMotionValue(typeof window !== "undefined" ? window.innerWidth / 2 : 0);
  const mouseY = useMotionValue(typeof window !== "undefined" ? window.innerHeight / 2 : 0);
  const springX = useSpring(mouseX, { stiffness: 80, damping: 25 });
  const springY = useSpring(mouseY, { stiffness: 80, damping: 25 });

  useEffect(() => {
    const update = () => {
      if (!spotlightRef.current) return;
      spotlightRef.current.style.background = `radial-gradient(700px circle at ${springX.get()}px ${springY.get()}px, rgba(213,176,113,0.22), transparent 70%)`;
    };
    update();
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
    <div className="min-h-screen flex flex-col items-center justify-center overflow-hidden relative" style={{ backgroundColor: "#FEF9F6" }}>
      <div ref={spotlightRef} className="absolute inset-0 pointer-events-none transition-none" />

      <div
        className="absolute inset-0 pointer-events-none opacity-[0.07]"
        style={{
          backgroundImage: `linear-gradient(rgba(0,0,0,0.4) 1px, transparent 1px), linear-gradient(90deg, rgba(0,0,0,0.4) 1px, transparent 1px)`,
          backgroundSize: "48px 48px",
        }}
      />

      <motion.img
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6 }}
        src="/ufma-logo.png"
        alt="UFMA Logo"
        className="mb-4 md:mb-6 size-36 md:size-60 relative z-10"
      />

      <motion.h1
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.2 }}
        className="text-2xl md:text-5xl font-bold text-gray-900 mb-3 md:mb-4 text-center relative z-10 px-4"
      >
        SISU UFMA {" "}
        <span style={{ color: "#D5B071" }}>Dashboard Analítico</span>
      </motion.h1>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6, duration: 0.8 }}
        className="text-sm md:text-base text-slate-500 mb-6 md:mb-10 text-center max-w-lg relative z-10 px-6"
      >
        Explore séries históricas, notas de corte, distribuições estatísticas e
        indicadores completos dos cursos da UFMA no SISU.
      </motion.p>

      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 1, duration: 0.4 }}
        className="relative z-10 w-full px-6 sm:px-10 flex justify-center"
      >
        <Autocomplete
          disablePortal
          options={cursos.map((c: { no_curso: string }) =>
            toTitleCase(c.no_curso)
          )}
          onChange={(_, value) => {
            if (value)
              setPendingUrl(`/cursos/${encodeURIComponent((value as string).toLowerCase())}`);
          }}
          slotProps={{
            paper: {
              sx: {
                backgroundColor: "#FEF9F6",
                border: "1px solid rgba(213,176,113,0.35)",
                "& .MuiAutocomplete-option": {
                  color: "rgba(30,27,22,0.8)",
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
            width: "min(400px, 100%)",
            "& .MuiOutlinedInput-root": {
              color: "#1e1b16",
              "& fieldset": { borderColor: "rgba(213,176,113,0.5)" },
              "&:hover fieldset": { borderColor: "rgba(213,176,113,0.7)" },
              "&.Mui-focused fieldset": { borderColor: "#D5B071" },
            },
            "& .MuiInputLabel-root": { color: "rgba(100,116,139,0.9)" },
            "& .MuiInputLabel-root.Mui-focused": { color: "#B8922E" },
            "& .MuiSvgIcon-root": { color: "rgba(100,116,139,0.7)" },
          }}
          renderInput={(params) => (
            <TextField {...params} label="Digite seu curso" />
          )}
        />
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.3, duration: 0.5 }}
        className="relative z-10 w-full px-6 sm:px-10 flex justify-center"
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1,
            mt: 2,
            width: "min(400px, 100%)",
          }}
        >
          <Box sx={{ flex: 1, height: "1px", bgcolor: "rgba(174,143,88,0.25)" }} />
          <span style={{ fontSize: 12, color: "rgba(100,116,139,0.7)" }}>ou</span>
          <Box sx={{ flex: 1, height: "1px", bgcolor: "rgba(174,143,88,0.25)" }} />
        </Box>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.45, duration: 0.4 }}
        className="relative z-10 w-full px-6 sm:px-10 flex justify-center mt-3"
      >
        <Box
          sx={{
            display: "flex",
            gap: 1.5,
            width: "min(400px, 100%)",
            flexDirection: { xs: "column", mobile: "row" },
          }}
        >
          <Button
            component={Link}
            href="/cursos"
            variant="outlined"
            size="small"
            fullWidth
            sx={{
              borderColor: "rgba(174,143,88,0.45)",
              color: "rgba(30,27,22,0.75)",
              fontSize: 13,
              textTransform: "none",
              "&:hover": {
                borderColor: "#ae8f58",
                backgroundColor: "rgba(174,143,88,0.06)",
              },
            }}
          >
            Explorar cursos
          </Button>
          <Button
            component={Link}
            href="/perfil"
            variant="outlined"
            size="small"
            fullWidth
            sx={{
              borderColor: "rgba(174,143,88,0.45)",
              color: "rgba(30,27,22,0.75)",
              fontSize: 13,
              textTransform: "none",
              "&:hover": {
                borderColor: "#ae8f58",
                backgroundColor: "rgba(174,143,88,0.06)",
              },
            }}
          >
            Analisar meu perfil
          </Button>
        </Box>
      </motion.div>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.3 }}
        transition={{ delay: 1.6, duration: 1 }}
        className="mt-8 md:mt-12 text-xs text-slate-500 relative z-10 px-4 text-center"
      >
        Trabalho de Iniciação Científica - Rafael Neves - PIBIC/CNPq 2025/2026
      </motion.p>

      <BackgroundParticles />

      {pendingUrl && (
        <motion.div
          className="absolute inset-0 z-50"
          style={{ backgroundColor: "#FEF9F6" }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.35, ease: "easeInOut" }}
          onAnimationComplete={() => router.push(pendingUrl)}
        />
      )}
    </div>
  );
}
