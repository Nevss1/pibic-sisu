"use client";

import { motion } from "framer-motion";
import { Autocomplete, TextField } from "@mui/material";
import { useCursos } from "@/src/hooks";
import { useRouter } from "next/navigation";
import { toTitleCase } from "../utils";
export default function HomePage() {
  const { data: cursos = [] } = useCursos();
  const router = useRouter();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
      <motion.img
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6 }}
        src="/ufma-logo.png"
        alt="UFMA Logo"
        className="mb-4 size-32"
      />

      <motion.h1
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
        className="text-5xl font-bold text-gray-800 mb-6 text-center"
      >
        SISU UFMA — Dashboard Analítico
      </motion.h1>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.7, duration: 1 }}
        className="text-lg text-gray-600 mb-10 text-center max-w-xl"
      >
        Explore séries históricas, notas de corte, distribuições estatísticas e
        indicadores completos dos cursos da UFMA no SISU.
      </motion.p>

      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 1.2, duration: 0.3 }}
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
          sx={{ width: 300 }}
          renderInput={(params) => (
            <TextField {...params} label="Digite seu curso" />
          )}
        />
      </motion.div>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.4 }}
        transition={{ delay: 1.2, duration: 1 }}
        className="mt-12 text-sm text-black"
      >
        Trabalho de Iniciação Científica - Rafael Neves - PIBIC/CNPq 2025/2026
      </motion.p>
    </div>
  );
}
