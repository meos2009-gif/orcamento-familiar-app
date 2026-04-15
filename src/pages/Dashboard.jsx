import { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);

export default function Dashboard() {
  const hoje = new Date();
  const [mes, setMes] = useState(hoje.getMonth() + 1);
  const [ano, setAno] = useState(hoje.getFullYear());

  const [transactions, setTransactions] = useState([]);
  const [categorias, setCategorias] = useState([]);

  useEffect(() => {
    carregarDados();
  }, [mes, ano]);

  async function carregarDados() {
    const mesStr = String(mes).padStart(2, "0");
    const proximoMes = String(mes + 1).padStart(2, "0");

    const { data: trans } = await supabase
      .from("transactions")
      .select("*")
      .filter("date", "gte", `${ano}-${mesStr}-01`)
      .filter("date", "lt", `${ano}-${proximoMes}-01`);

    const { data: cat } = await supabase.from("categories").select("*");

    setTransactions(trans || []);
    setCategorias(cat || []);
  }

  // Separar entradas e saídas
  const entradas = transactions.filter((t) => t.type === "entrada");
  const saidas = transactions.filter((t) => t.type === "saida");

  // Totais
  const totalEntradas = entradas.reduce((acc, e) => acc + Number(e.amount), 0);
  const totalSaidas = saidas.reduce((acc, s) => acc + Number(s.amount), 0);
  const saldoMes = totalEntradas - totalSaidas;

  // Totais por categoria (mês)
  const categoriasMensal = categorias.map((cat) => {
    const total = saidas
      .filter((s) => s.category_id === cat.id)
      .reduce((acc, s) => acc + Number(s.amount), 0);

    return { nome: cat.name || "Sem Nome", total };
  });

  // Totais acumulados por categoria (ano inteiro)
  const categoriasAcumulado = categorias.map((cat) => {
    const total = transactions
      .filter(
        (t) =>
          t.type === "saida" &&
          new Date(t.date).getFullYear() === ano &&
          t.category_id === cat.id
      )
      .reduce((acc, t) => acc + Number(t.amount), 0);

    return { nome: cat.name || "Sem Nome", total };
  });

  // Gráfico por categoria
  const chartCategorias = {
    labels: categoriasMensal.map((c) => c.nome),
    datasets: [
      {
        label: "Gastos por Categoria (Mês)",
        data: categoriasMensal.map((c) => c.total),
        backgroundColor: "#4e79ff",
      },
    ],
  };

  return (
    <div className="dashboard">
      <h2>Dashboard</h2>

      {/* FILTROS */}
      <div className="filtros" style={{ display: "flex", gap: "10px", marginBottom: "20px" }}>
        <select value={mes} onChange={(e) => setMes(Number(e.target.value))}>
          {Array.from({ length: 12 }, (_, i) => i + 1).map((m) => (
            <option key={m} value={m}>
              {m.toString().padStart(2, "0")}
            </option>
          ))}
        </select>

        <select value={ano} onChange={(e) => setAno(Number(e.target.value))}>
          {[2024, 2025, 2026, 2027].map((a) => (
            <option key={a} value={a}>
              {a}
            </option>
          ))}
        </select>
      </div>

      {/* CARDS */}
      <div className="cards">
        <div className="card">
          <h4>Entradas (mês)</h4>
          <p>{totalEntradas.toFixed(2)} €</p>
        </div>

        <div className="card">
          <h4>Saídas (mês)</h4>
          <p>{totalSaidas.toFixed(2)} €</p>
        </div>

        <div className="card">
          <h4>Saldo</h4>
          <p>{saldoMes.toFixed(2)} €</p>
        </div>
      </div>

      {/* QUADRO MENSAL */}
      <div className="tabela-categorias">
        <h3>Despesas por Categoria (Mês)</h3>
        <table>
          <thead>
            <tr>
              <th>Categoria</th>
              <th>Total (€)</th>
            </tr>
          </thead>
          <tbody>
            {categoriasMensal.map((c) => (
              <tr key={c.nome}>
                <td>{c.nome}</td>
                <td>{c.total.toFixed(2)} €</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* QUADRO ACUMULADO */}
      <div className="tabela-categorias">
        <h3>Despesas por Categoria (Acumulado Ano)</h3>
        <table>
          <thead>
            <tr>
              <th>Categoria</th>
              <th>Total (€)</th>
            </tr>
          </thead>
          <tbody>
            {categoriasAcumulado.map((c) => (
              <tr key={c.nome}>
                <td>{c.nome}</td>
                <td>{c.total.toFixed(2)} €</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* GRÁFICO POR CATEGORIA */}
      <div className="grafico">
        <h3>Gastos por Categoria (Gráfico)</h3>
        <Bar data={chartCategorias} />
      </div>
    </div>
  );
}
