import { Link, useLocation } from "react-router-dom";

export default function Sidebar() {
  const { pathname } = useLocation();

  const active = (path) =>
    pathname === path ? "sidebar-link active" : "sidebar-link";

  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <h2>Orçamento Familiar</h2>
      </div>

      <nav className="sidebar-nav">
        <Link className={active("/")} to="/">📊 Dashboard</Link>
        <Link className={active("/entradas")} to="/entradas">➕ Entradas</Link>
        <Link className={active("/saidas")} to="/saidas">➖ Saídas</Link>
        <Link className={active("/categorias")} to="/categorias">🏷️ Categorias</Link>
      </nav>
    </aside>
  );
}
