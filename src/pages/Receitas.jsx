import { useState, useEffect } from "react";
import { supabase } from "../supabaseClient";

export default function Receitas() {
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

  async function guardarReceita(e) {
    e.preventDefault();

    // Se a empresa não existir, adiciona automaticamente
    if (!empresas.find((e) => e.nome === descricao)) {
      await supabase.from("empresas").insert([{ nome: descricao }]);
    }

    await supabase.from("transactions").insert([
      {
        type: "entrada",
        category_id: categoria,
        date: data,
        amount: valor,
        description: descricao,
      },
    ]);

    alert("Receita registada!");
    setValor("");
    setDescricao("");
  }

  return (
    <div className="formulario">
      <h2>Nova Receita</h2>

      <form onSubmit={guardarReceita}>
        
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
          placeholder="Empresa / origem da receita"
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
