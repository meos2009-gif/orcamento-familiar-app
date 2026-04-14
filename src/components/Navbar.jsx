import { useAuth } from "../context/AuthContext";

export default function Navbar() {
  const { signOut } = useAuth();

  return (
    <header className="navbar">
      <div className="navbar-title"></div>

      <button className="logout-btn" onClick={signOut}>
        Sair
      </button>
    </header>
  );
}
