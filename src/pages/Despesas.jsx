import { useState, useEffect } from "react";
import { supabase } from "../supabaseClient";

export default function Despesas() {
  const [categorias, setCategorias] = useState([]);
  const [empresas, setEmpresas] = useState([]);

  const [categoria, setCategoria] = useState("");
  const [data, setData] = useState("");
  const [valor, setValor] = useState("");
  const [descricao, setDescricao] = useState("");

  useEffect(() => {
    carregarCategorias();
    carregarEmpresas();
  }, []);

  async function carregarCategorias() {
    const { data } = await supabase.from("categories").select("*");
    setCategorias(data || []);
  }

  async function carregarEmpresas() {
    const { data } = await supabase.from("empresas").select("*");
    setEmpresas(data || []);
  }

  async function guardarDespesa(e) {
    e.preventDefault();

    // 🔥 Buscar utilizador autenticado (OBRIGATÓRIO PARA RLS)
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      alert("Utilizador não autenticado.");
      return;
    }

    // 🔥 Validar formato da data
    if (!/^\d{4}-\d{2}-\d{2}$/.test(data)) {
      alert("Data inválida. Use o seletor de data.");
      return;
    }

    if (!categoria) {
      alert("Escolha uma categoria.");
      return;
    }

    // 🔥 Criar empresa automaticamente se não existir
    if (!empresas.find((e) => e.nome === descricao)) {
      await supabase.from("empresas").insert([{ nome: descricao }]);
    }

    // 🔥 Inserir despesa COM user_id (ESSENCIAL PARA RLS)
    const { data: inserted, error } = await supabase
      .from("transactions")
      .insert([
        {
          type: "saida",
          category_id: categoria,
          date: data,
          amount: valor,
          description: descricao,
          user_id: user.id, // ← SEM ISTO O SUPABASE BLOQUEIA
        },
      ])
      .select();

    console.log("Despesa gravada:", inserted);

    if (error) {
      console.error(error);
      alert("Erro ao gravar despesa.");
      return;
    }

    alert("Despesa registada!");

    setValor("");
    setDescricao("");
    setData("");
    setCategoria("");
  }

  return (
    <div className="formulario">
      <h2>Nova Despesa</h2>

      <form onSubmit={guardarDespesa}>
        
        {/* CATEGORIA */}
        <label>Categoria</label>
        <select value={categoria} onChange={(e) => setCategoria(e.target.value)} required>
          <option value="">Selecione...</option>
          {categorias.map((c) => (
            <option key={c.id} value={c.id}>{c.name}</option>
          ))}
        </select>

        {/* DATA */}
        <label>Data</label>
        <input
          type="date"
          lang="en-CA" // ← FIX PARA CHROME PT-PT
          value={data}
          onChange={(e) => setData(e.target.value)}
          required
        />

        {/* VALOR */}
        <label>Valor (€)</label>
        <input
          type="number"
          step="0.01"
          value={valor}
          onChange={(e) => setValor(e.target.value)}
          required
        />

        {/* DESCRIÇÃO / EMPRESA */}
        <label>Descrição (empresa)</label>
        <input
          list="listaEmpresas"
          value={descricao}
          onChange={(e) => setDescricao(e.target.value)}
          placeholder="Mercadona, Continente, Zara..."
          required
        />

        <datalist id="listaEmpresas">
          {empresas.map((e) => (
            <option key={e.id} value={e.nome} />
          ))}
        </datalist>

        <button type="submit">Guardar</button>
      </form>
    </div>
  );
}
