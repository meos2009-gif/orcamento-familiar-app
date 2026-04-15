import { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Navbar() {
  const { signOut } = useAuth();
  const [open, setOpen] = useState(false);

  return (
    <header className="navbar">
      <div className="navbar-title">Orçamento Familiar</div>

      {/* MENU DESKTOP */}
      <nav className="navbar-links desktop">
        <Link to="/">Dashboard</Link>
        <Link to="/entradas">Entradas</Link>
        <Link to="/saidas">Saídas</Link>
        <Link to="/categorias">Categorias</Link>
      </nav>

      {/* BOTÃO LOGOUT DESKTOP */}
      <button className="logout-btn desktop" onClick={signOut}>
        Sair
      </button>

      {/* HAMBURGER MOBILE */}
      <div className="hamburger" onClick={() => setOpen(!open)}>
        <div className={open ? "bar open" : "bar"}></div>
        <div className={open ? "bar open" : "bar"}></div>
        <div className={open ? "bar open" : "bar"}></div>
      </div>

      {/* MENU MOBILE */}
      {open && (
        <nav className="navbar-mobile">
          <Link to="/" onClick={() => setOpen(false)}>Dashboard</Link>
          <Link to="/entradas" onClick={() => setOpen(false)}>Entradas</Link>
          <Link to="/saidas" onClick={() => setOpen(false)}>Saídas</Link>
          <Link to="/categorias" onClick={() => setOpen(false)}>Categorias</Link>

          <button className="logout-btn mobile" onClick={signOut}>
            Sair
          </button>
        </nav>
      )}
    </header>
  );
}
