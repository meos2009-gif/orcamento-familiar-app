import { Link } from "react-router-dom";
import "./Sidebar.css";
export default function Sidebar({ open, onClose }) {
  return (
    <>
      <div
        className={`sidebar-overlay ${open ? "show" : ""}`}
        onClick={onClose}
      />

      <aside className={`sidebar ${open ? "open" : ""}`}>
        <nav>
          <ul>
            <li><Link to="/dashboard" onClick={onClose}>Dashboard</Link></li>
            <li><Link to="/receitas" onClick={onClose}>Receitas</Link></li>
            <li><Link to="/despesas" onClick={onClose}>Despesas</Link></li>
            <li><Link to="/categorias" onClick={onClose}>Categorias</Link></li>
          </ul>
        </nav>
      </aside>
    </>
  );
}
