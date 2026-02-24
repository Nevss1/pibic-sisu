export default function DashboardLayout({ children }) {
  return (
    <div className="flex min-h-screen">

      <aside className="w-54 text-white p-6 space-y-4 items-center flex flex-col bg-gray-300">
        <h2 className="text-2xl font-bold text-black">SISU UFMA</h2>

        <img src="/ufma-logo.png" alt="UFMA Logo" className="mb-4 size-24"/>

        <nav className="space-y-3 px-6">
          <a className="block hover:text-blue-800 text-black" href="/dashboard">Home</a>
          <a className="block hover:text-blue-800 text-black" href="/dashboard/areas">Áreas</a>
          <a className="block hover:text-blue-800 text-black" href="/dashboard/cursos">Cursos</a>
          <a className="block hover:text-blue-800 text-black" href="/dashboard/modalidades">Modalidades</a>
          <a className="block hover:text-blue-800 text-black" href="/dashboard/campi">Campus</a>
          <a className="block hover:text-blue-800 text-black" href="/dashboard/anual">Evolução Anual</a>
          <a className="block hover:text-blue-800 text-black" href="/dashboard/predicao">Predição</a>
          <a className="block hover:text-blue-800 text-black" href="/dashboard/colunas">Informações disponíveis</a>
          <a className="block hover:text-blue-800 text-black" href="/dashboard/conta">Conta</a>
          <a className="block hover:text-blue-800 text-black" href="/">Sair</a>
        </nav>
      </aside>

      <main className="flex-1 p-10 bg-gray-300">{children}</main>
    </div>
  );
}
