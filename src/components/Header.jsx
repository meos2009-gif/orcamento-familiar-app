import { useTheme } from "../context/ThemeContext";
import "./Header.css";

export default function Header() {
  const { theme, toggleTheme } = useTheme();

  return (
    <header className="header">
      <h1>Orçamento Familiar</h1>

      <button onClick={toggleTheme} className="theme-toggle">
        {theme === "light" ? "🌙 Modo Escuro" : "☀️ Modo Claro"}
      </button>
    </header>
  );
}
