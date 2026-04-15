import { useState } from "react";
import "./Navbar.css";

export default function Navbar({ onToggleSidebar }) {
  return (
    <header className="navbar">
      <button className="hamburger" onClick={onToggleSidebar}>
        ☰
      </button>

      <h1 className="navbar-title">Orçamento Familiar</h1>
    </header>
  );
}
