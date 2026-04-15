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
  const [transacoes, setTransacoes] = useState([]);
  const [categorias, setCategorias] = useState([]);

  const hoje = new Date();
  const mesAtual = hoje.getMonth() + 1;
  const anoAtual = hoje.getFullYear();

  useEffect(() => {
    carregarDados();
  }, []);

  async function carregarDados() {
    // Buscar transações do mês atual
    const { data: trans } = await supabase
      .from("transacoes")
      .select("*")
      .gte("data", `${anoAtual}-${mesAtual}-01`)
      .lte("data", `${anoAtual}-${mesAtual}-31`);

    const { data: cat } = await supabase.from("categorias").select("*");

    setTransacoes(trans || []);
    setCategorias(cat || []);
  }

  // Separar entradas e saídas
  const entradas = transacoes.filter((t) => t.tipo === "entrada");
  const saidas = transacoes.filter((t) => t.tipo === "saida");

  // Totais
  const totalEntradas = entradas.reduce((acc, e) => acc + e.valor, 0);
  const totalSaidas = saidas.reduce((acc, s) => acc + s.valor, 0);
  const saldoMes = totalEntradas - totalSaidas;

  // Acumulado anual
  const acumuladoAno = transacoes
    .filter((t) => t.tipo === "entrada")
    .reduce((acc, t) => acc + t.valor, 0);

  // Totais por categoria (somente saídas)
  const categoriasTotais = categorias.map((cat) => {
    const total = saidas
      .filter((s) => s.categoria_id === cat.id)
      .reduce((acc, s) => acc + s.valor, 0);

    return { nome: cat.nome, total };
  });

  // Gráfico
  const chartData = {
    labels: categoriasTotais.map((c) => c.nome),
    datasets: [
      {
        label: "Gastos por Categoria",
        data: categoriasTotais.map((c) => c.total),
        backgroundColor: "#4e79ff",
      },
    ],
  };

  return (
    <div className="dashboard">
      <h2>Dashboard</h2>

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

        <div className="card">
          <h4>Acumulado Ano</h4>
          <p>{acumuladoAno.toFixed(2)} €</p>
        </div>
      </div>

      {/* GRÁFICO */}
      <div className="grafico">
        <Bar data={chartData} />
      </div>

      {/* TABELA POR CATEGORIA */}
      <div className="tabela-categorias">
        <h3>Gastos por Categoria</h3>
        <table>
          <thead>
            <tr>
              <th>Categoria</th>
              <th>Total (€)</th>
            </tr>
          </thead>
          <tbody>
            {categoriasTotais.map((c) => (
              <tr key={c.nome}>
                <td>{c.nome}</td>
                <td>{c.total.toFixed(2)} €</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
