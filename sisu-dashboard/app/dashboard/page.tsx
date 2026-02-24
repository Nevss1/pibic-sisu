"use client";

import { Card, YearToggleGroup, CursoSelect, GraficoSerieTemporalNotas } from "@/app/components";
import { calcularDadosPorAno, calcularMedia, calcularTotalCandidatos } from "@/app/utils";
import { useDashboard } from "@/app/hooks";

export default function Dashboard() {
  const { curso, setCurso, dados, anosSelecionados, setAnosSelecionados, buscarDados, anos } = useDashboard();
  
  const dadosPorAno = calcularDadosPorAno(dados, anosSelecionados);
  const totalCandidatos = calcularTotalCandidatos(dados)
  const mediaNotaCandidato = calcularMedia(dadosPorAno, "media_nota_candidato")
  const mediaNotaCorte = calcularMedia(dadosPorAno, "media_nota_corte")
  const taxaAprovacao = calcularMedia(dadosPorAno, "taxa_aprovacao")

  console.log(dadosPorAno)

  return (
    <div className="min-h-screen p-10 bg-gray-100 rounded-lg">
      <h1 className="text-4xl font-bold mb-6 text-gray-800">
        Dashboard SISU UFMA
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
        <Card title="Candidatos" data={totalCandidatos} />
        <Card title="Nota média" data={mediaNotaCandidato} />
        <Card title="Nota de corte média" data={mediaNotaCorte} />
        <Card title="Taxa de Aprovação" data={`${taxaAprovacao}%`} />
      </div>

      <div className="flex gap-3 mb-6">
        <CursoSelect
          onCursoSelecionado={(cursoEscolhido) => {
            setCurso(cursoEscolhido);
            buscarDados(cursoEscolhido);
          }}
        />

        <button
          onClick={() => buscarDados(curso)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded"
        >
          Buscar
        </button>
      </div>
      <YearToggleGroup
        items={anos}
        selected={anosSelecionados}
        onChange={setAnosSelecionados}
      />

      <GraficoSerieTemporalNotas dados={dadosPorAno} />
    </div>
  );
}
