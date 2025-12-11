export default function DashboardLayout({ children }) {
  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <aside className="w-64 bg-gray-900 text-white p-6 space-y-4">
        <h2 className="text-2xl font-bold mb-8">SISU UFMA</h2>

        <nav className="space-y-3">
          <a className="block hover:text-blue-300" href="/dashboard">📊 Dashboard</a>
          <a className="block hover:text-blue-300" href="/dashboard/cursos">🎓 Cursos</a>
          <a className="block hover:text-blue-300" href="/dashboard/modalidades">🧬 Modalidades</a>
          <a className="block hover:text-blue-300" href="/dashboard/campi">🏫 Campi</a>
          <a className="block hover:text-blue-300" href="/dashboard/anual">📈 Evolução Anual</a>
        </nav>
      </aside>

      {/* Conteúdo */}
      <main className="flex-1 p-10 bg-gray-50">{children}</main>
    </div>
  );
}
