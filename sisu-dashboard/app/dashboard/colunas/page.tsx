import colunas from "@/app/data/colunas.json";

export default function ColunasPage() {
  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 p-10">
      <h1 className="text-4xl font-bold mb-10">📘 Dicionário de Dados — SISU</h1>
      <a 
        href="https://dadosabertos.mec.gov.br/sisu/item/133-dicionario-de-dados" 
        target="_blank" 
        rel="noopener noreferrer" 
        className="text-blue-400 underline mb-6 inline-block"
      >
        Fonte: Dados Abertos MEC
      </a>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {Object.entries(colunas).map(([campo, info]) => (
          <div
            key={campo}
            className="bg-gray-800 p-5 rounded-lg border border-gray-700 shadow"
          >
            <h2 className="text-xl font-bold text-blue-300">{campo}</h2>
            <p className="text-gray-400 mt-1"><b>Nome:</b> {info.nome}</p>
            <p className="text-gray-400"><b>Tipo:</b> {info.tipo}</p>
            <p className="text-gray-300 mt-2">{info.descricao}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
