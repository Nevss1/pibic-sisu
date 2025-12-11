"use client";

import Link from "next/link";
import { motion } from "framer-motion";

export default function HomePage() {
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
        Explore séries históricas, notas de corte, distribuições estatísticas
        e indicadores completos dos cursos da UFMA no SISU.
      </motion.p>


        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1}}
          transition={{ delay: 1.2, duration: 0.3 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.97 }}
        >
          <Link
            href="/dashboard"
            className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-lg text-xl font-semibold transition-all shadow-lg text-center"
          >
            Acessar Dashboard
          </Link>
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
