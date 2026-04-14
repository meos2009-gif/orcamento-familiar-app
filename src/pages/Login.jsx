import { useState } from "react";
import { supabase } from "../supabaseClient";
import { useAuth } from "../context/AuthContext";
import { Navigate, Link } from "react-router-dom";

export default function Login() {
  const { user } = useAuth();

  // Se já estiver autenticado → redireciona para o dashboard
  if (user) return <Navigate to="/" replace />;

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleLogin(e) {
    e.preventDefault();
    setLoading(true);

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    setLoading(false);

    if (error) {
      alert("Erro: " + error.message);
      return;
    }

    // Login OK → redireciona
    window.location.href = "/";
  }

  return (
    <div className="login-container">
      <div className="login-card">
        <h2>Entrar</h2>

        <form onSubmit={handleLogin}>
          <input
            type="email"
            placeholder="Email"
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <input
            type="password"
            placeholder="Palavra-passe"
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <button type="submit" disabled={loading}>
            {loading ? "A entrar..." : "Entrar"}
          </button>
        </form>

        <p className="login-register-text">
          Ainda não tens conta? <Link to="/register">Registar</Link>
        </p>
      </div>
    </div>
  );
}
