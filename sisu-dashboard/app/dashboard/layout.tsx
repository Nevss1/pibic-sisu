export default function DashboardLayout({ children }) {
  return (
    <div className="flex min-h-screen">

      <aside className="w-54 bg-gray-900 text-white p-6 space-y-4 items-center flex flex-col">
        <h2 className="text-2xl font-bold">SISU UFMA</h2>

        <img src="/ufma-logo.png" alt="UFMA Logo" className="mb-4 size-24"/>

        <nav className="space-y-3">
          <a className="block hover:text-blue-300" href="/dashboard">Home</a>
          <a className="block hover:text-blue-300" href="/dashboard/areas">Áreas</a>
          <a className="block hover:text-blue-300" href="/dashboard/cursos">Cursos</a>
          <a className="block hover:text-blue-300" href="/dashboard/modalidades">Modalidades</a>
          <a className="block hover:text-blue-300" href="/dashboard/campi">Campus</a>
          <a className="block hover:text-blue-300" href="/dashboard/anual">Evolução Anual</a>
          <a className="block hover:text-blue-300" href="/dashboard/anual">Predição</a>
          <a className="block hover:text-blue-300" href="/dashboard/colunas">Informações disponíveis</a>
          <a className="block hover:text-blue-300" href="/dashboard/conta">Conta</a>
          <a className="block hover:text-blue-300" href="/">Sair</a>
        </nav>
      </aside>

      <main className="flex-1 p-10 bg-gray-50">{children}</main>
    </div>
  );
}
