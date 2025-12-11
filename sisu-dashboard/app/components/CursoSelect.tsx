"use client";

import { useState, useEffect } from "react";

type CursoSelectProps = {
  onCursoSelecionado: (cursoNome: string) => void;
};

export default function CursoSelect({ onCursoSelecionado }: CursoSelectProps) {
  const [texto, setTexto] = useState("");
  const [sugestoes, setSugestoes] = useState([]);

  useEffect(() => {
    if (texto.length < 2) {
      setSugestoes([]);
      return;
    }

    const timeout = setTimeout(async () => {
      const res = await fetch(`/api/cursos?q=${texto}`);
      const data = await res.json();
      setSugestoes(data);
    }, 300);

    return () => clearTimeout(timeout);
  }, [texto]);

  return (
    <div className="w-80 relative">
      <input
        value={texto}
        onChange={(e) => setTexto(e.target.value)}
        placeholder="Digite um curso..."
        className="border rounded px-4 py-2 w-full text-black"
      />

      {sugestoes.length > 0 && (
        <div className="absolute left-0 right-0 bg-white border rounded shadow mt-1 max-h-60 overflow-auto z-20">
          {sugestoes.map((item, idx) => (
            <div
              key={idx}
              className="p-2 hover:bg-gray-100 cursor-pointer text-black"
              onClick={() => {
                setTexto(item.no_curso);
                onCursoSelecionado(item.no_curso);
                setSugestoes([]);
              }}
            >
              {item.no_curso}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
