import { useState, useEffect } from "react";
import { supabase } from "../supabaseClient";
import { useAuth } from "../context/AuthContext";
import Filtros from "../components/Filtros";

export default function Entradas() {
  const { user } = useAuth();

  const [descricao, setDescricao] = useState("");
  const [valor, setValor] = useState("");
  const [data, setData] = useState("");
  const [categoriaId, setCategoriaId] = useState("");

  const [categorias, setCategorias] = useState([]);

  const [mes, setMes] = useState("");
  const [ano, setAno] = useState("");
  const [categoriaFiltro, setCategoriaFiltro] = useState("");

  const [entradas, setEntradas] = useState([]);

  // Carregar categorias
  async function loadCategorias() {
    const { data } = await supabase
      .from("categories")
      .select("*")
      .eq("user_id", user.id)
      .order("name", { ascending: true });

    setCategorias(data || []);
  }

  // Carregar entradas
  async function loadEntradas() {
    let query = supabase
      .from("transactions")
      .select("*")
      .eq("type", "entrada")
      .eq("user_id", user.id);

    if (ano) query = query.like("date", `${ano}-%`);
    if (mes) query = query.like("date", `%-${mes}-%`);
    if (categoriaFiltro) query = query.eq("category_id", categoriaFiltro);

    const { data } = await query.order("date", { ascending: false });
    setEntradas(data || []);
  }

  useEffect(() => {
    if (user) {
      loadCategorias();
      loadEntradas();
    }
  }, [user, mes, ano, categoriaFiltro]);

  // Adicionar entrada
  async function handleAdd(e) {
    e.preventDefault();

    const { error } = await supabase.from("transactions").insert({
      description: descricao,
      amount: Number(valor),
      date: data,
      category_id: categoriaId,
      type: "entrada",
      user_id: user.id,
    });

    if (error) {
      alert("Erro: " + error.message);
      return;
    }

    setDescricao("");
    setValor("");
    setData("");
    setCategoriaId("");

    loadEntradas();
  }

  // Apagar entrada
  async function handleDelete(id) {
    const { error } = await supabase
      .from("transactions")
      .delete()
      .eq("id", id)
      .eq("user_id", user.id);

    if (error) {
      alert("Erro ao apagar: " + error.message);
      return;
    }

    loadEntradas();
  }

  return (
    <div className="page">
      <h1>Entradas</h1>

      {/* FILTROS */}
      <Filtros mes={mes} ano={ano} setMes={setMes} setAno={setAno} />

      <select
        value={categoriaFiltro}
        onChange={(e) => setCategoriaFiltro(e.target.value)}
        className="filtro-categoria"
      >
        <option value="">Todas as categorias</option>
        {categorias.map((c) => (
          <option key={c.id} value={c.id}>
            {c.name}
          </option>
        ))}
      </select>

      {/* FORMULÁRIO */}
      <div className="card">
        <h2>Nova Entrada</h2>

        <form onSubmit={handleAdd}>
          <input
            type="text"
            placeholder="Descrição"
            value={descricao}
            onChange={(e) => setDescricao(e.target.value)}
            required
          />

          <input
            type="number"
            placeholder="Valor"
            value={valor}
            onChange={(e) => setValor(e.target.value)}
            required
          />

          <input
            type="date"
            value={data}
            onChange={(e) => setData(e.target.value)}
            required
          />

          <select
            value={categoriaId}
            onChange={(e) => setCategoriaId(e.target.value)}
          >
            <option value="">Sem categoria</option>
            {categorias.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>

          <button type="submit">Adicionar</button>
        </form>
      </div>

      {/* LISTA */}
      <div className="card">
        <h2>Lista</h2>

        {entradas.length === 0 ? (
          <p className="empty">Nenhum registo encontrado.</p>
        ) : (
          <table className="table">
            <tbody>
              {entradas.map((item) => (
                <tr key={item.id}>
                  <td data-label="Descrição">{item.description}</td>

                  <td data-label="Valor" className="valor entrada">
