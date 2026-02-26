export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen">

      <aside className="w-54 text-white p-6 space-y-4 items-center flex flex-col bg-gray-300">
        <h2 className="text-2xl font-bold text-black">SISU UFMA</h2>

        <img src="/ufma-logo.png" alt="UFMA Logo" className="mb-4 size-24"/>

        <nav className="space-y-3 px-6">
          <a className="block hover:text-blue-800 text-black" href="/analise">Panorama</a>
          <a className="block hover:text-blue-800 text-black" href="/areas">Áreas</a>
          <a className="block hover:text-blue-800 text-black" href="/cursos">Cursos</a>
          <a className="block hover:text-blue-800 text-black" href="/predicao">Predição</a>
          <a className="block hover:text-blue-800 text-black" href="/colunas">Informações disponíveis</a>
          <a className="block hover:text-blue-800 text-black" href="/conta">Conta</a>
          <a className="block hover:text-blue-800 text-black" href="/">Sair</a>
        </nav>
      </aside>

      <main className="flex-1 p-10 bg-gray-300">{children}</main>
    </div>
  );
}
