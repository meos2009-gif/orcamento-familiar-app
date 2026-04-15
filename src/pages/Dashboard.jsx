import { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";
import { Bar, Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  BarElement,
  LineElement,
  PointElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  BarElement,
  LineElement,
  PointElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend
);

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

  // Totais por categoria
  const categoriasTotais = categorias.map((cat) => {
    const total = saidas
      .filter((s) => s.category_id === cat.id)
      .reduce((acc, s) => acc + Number(s.amount), 0);

    return { nome: cat.nome, total };
  });

  // Gráfico por categoria
  const chartCategorias = {
    labels: categoriasTotais.map((c) => c.nome),
    datasets: [
      {
        label: "Gastos por Categoria",
        data: categoriasTotais.map((c) => c.total),
        backgroundColor: "#4e79ff",
      },
    ],
  };

  // Gráfico de evolução mensal (linha)
  const mesesLabels = [
    "Jan", "Fev", "Mar", "Abr", "Mai", "Jun",
    "Jul", "Ago", "Set", "Out", "Nov", "Dez"
  ];

  const gastosPorMes = Array(12).fill(0);

  transactions.forEach((t) => {
    const m = new Date(t.date).getMonth();
    if (t.type === "saida") {
      gastosPorMes[m] += Number(t.amount);
    }
  });

  const chartEvolucao = {
    labels: mesesLabels,
    datasets: [
      {
        label: "Gastos Mensais",
        data: gastosPorMes,
        borderColor: "#ff4e4e",
        backgroundColor: "rgba(255, 78, 78, 0.3)",
        tension: 0.3,
      },
    ],
  };

  return (
    <div className="dashboard">
      <h2>Dashboard</h2>

      {/* FILTROS */}
      <div className="filtros">
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

      {/* GRÁFICO DE EVOLUÇÃO */}
      <div className="grafico">
        <h3>Evolução Mensal</h3>
        <Line data={chartEvolucao} />
      </div>

      {/* GRÁFICO POR CATEGORIA */}
      <div className="grafico">
        <h3>Gastos por Categoria</h3>
        <Bar data={chartCategorias} />
      </div>
    </div>
  );
}
