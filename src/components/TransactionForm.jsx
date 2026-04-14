import { useState } from "react";
import { supabase } from "../supabaseClient";
import { useAuth } from "../context/AuthContext";
import { useTransactions } from "../hooks/useTransactions";

export default function TransactionForm({ type }) {
  const { user } = useAuth();
  const { reload } = useTransactions();

  const [form, setForm] = useState({
    description: "",
    amount: "",
    category_id: "",
    date: "",
  });

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!user) return;

    const { error } = await supabase.from("transactions").insert({
      ...form,
      amount: Number(form.amount),
      type,
      user_id: user.id,
    });

    if (error) {
      console.error("Erro ao adicionar transação:", error);
      return;
    }

    // Atualiza a lista imediatamente
    reload();

    // Limpa o formulário
    setForm({
      description: "",
      amount: "",
      category_id: "",
      date: "",
    });
  }

  return (
    <form onSubmit={handleSubmit} style={{ marginBottom: "20px" }}>
      <h3>Nova {type === "entrada" ? "Entrada" : "Saída"}</h3>

      <input
        type="text"
        name="description"
        placeholder="Descrição"
        value={form.description}
        onChange={handleChange}
        required
      />

      <input
        type="number"
        name="amount"
        placeholder="Valor"
        value={form.amount}
        onChange={handleChange}
        required
      />

      <input
        type="date"
        name="date"
        value={form.date}
        onChange={handleChange}
        required
      />

      <input
        type="text"
        name="category_id"
        placeholder="ID da Categoria"
        value={form.category_id}
        onChange={handleChange}
      />

      <button type="submit">Adicionar</button>
    </form>
  );
}
