import { Link } from "react-router-dom";
import "./Sidebar.css";

export default function Sidebar() {
  return (
    <aside className="sidebar">
      <nav>
        <ul>
          <li><Link to="/dashboard">Dashboard</Link></li>
          <li><Link to="/receitas">Receitas</Link></li>
          <li><Link to="/despesas">Despesas</Link></li>
          <li><Link to="/categorias">Categorias</Link></li>
        </ul>
      </nav>
    </aside>
  );
}
