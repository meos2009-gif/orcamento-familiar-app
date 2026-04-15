import { useState, useEffect } from "react";
import { supabase } from "../supabaseClient";
import { useAuth } from "../context/AuthContext";

export default function Categorias() {
  const { user } = useAuth();

  const [nome, setNome] = useState("");
  const [categorias, setCategorias] = useState([]);

  async function loadCategorias() {
    const { data } = await supabase
      .from("categories")
      .select("*")
      .eq("user_id", user.id)
      .order("name", { ascending: true });

    setCategorias(data || []);
  }

  useEffect(() => {
    if (user) loadCategorias();
  }, [user]);

  async function handleAdd(e) {
    e.preventDefault();

    const { error } = await supabase.from("categories").insert({
      name: nome,
      user_id: user.id,
    });

    if (error) {
      alert("Erro: " + error.message);
      return;
    }

    setNome("");
    loadCategorias();
  }

  async function handleDelete(id) {
    const { error } = await supabase
      .from("categories")
      .delete()
      .eq("id", id)
      .eq("user_id", user.id);

    if (error) {
      alert("Erro ao apagar: " + error.message);
      return;
    }

    loadCategorias();
  }

  return (
    <div className="page">
      <h1>Categorias</h1>

      <div className="card">
        <h2>Nova Categoria</h2>

        <form onSubmit={handleAdd}>
          <input
            type="text"
            placeholder="Nome da categoria"
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            required
          />

          <button type="submit">Adicionar</button>
        </form>
      </div>

      <div className="card">
        <h2>Lista</h2>

        {categorias.length === 0 ? (
          <p className="empty">Nenhuma categoria encontrada.</p>
        ) : (
          <table className="table">
            <tbody>
              {categorias.map((c) => (
                <tr key={c.id}>
                  <td>{c.name}</td>
                  <td>
                    <button
                      className="delete-btn"
                      onClick={() => handleDelete(c.id)}
                    >
                      Apagar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
