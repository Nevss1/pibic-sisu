"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";

export default function CursosPage() {
  const [cursos, setCursos] = useState<string[]>([]);

  async function carregarCursos() {
    const res = await fetch("/api/cursos");
    const json = await res.json();
    setCursos(json.map((c: any) => c.no_curso));
  }

  useEffect(() => {
    carregarCursos();
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 px-10 py-14">

      <div className="max-w-5xl mx-auto">
        <h1 className="text-4xl font-bold text-gray-800 mb-3">
          Cursos Disponíveis
        </h1>

        <p className="text-gray-600 mb-10">
          Selecione um curso abaixo para visualizar estatísticas detalhadas do SISU-UFMA.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {cursos.map((curso) => (
            <motion.div
              key={curso}
              whileHover={{ y: -4 }}
              transition={{ duration: 0.15 }}
            >
              <Link
                href={`/dashboard/cursos/${encodeURIComponent(curso)}`}
                className="
                  block bg-white border border-gray-200 
                  hover:border-blue-400 hover:shadow-lg 
                  transition-all rounded-xl p-5
                "
              >
                <h2 className="text-lg font-semibold text-gray-900">
                  {curso}
                </h2>

                <p className="text-sm text-gray-500 mt-1">
                  Ver estatísticas →
                </p>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
