import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "./Sidebar.css";

export default function Sidebar({ open, onClose }) {
  const { signOut } = useAuth();

  return (
    <aside className={`sidebar ${open ? "open" : ""}`}>
      <nav className="sidebar-nav">
        <Link to="/" onClick={onClose} className="sidebar-link">Dashboard</Link>
        <Link to="/entradas" onClick={onClose} className="sidebar-link">Entradas</Link>
        <Link to="/saidas" onClick={onClose} className="sidebar-link">Saídas</Link>
        <Link to="/categorias" onClick={onClose} className="sidebar-link">Categorias</Link>

        <button className="sidebar-logout" onClick={signOut}>
          Sair
        </button>
      </nav>
    </aside>
  );
}
