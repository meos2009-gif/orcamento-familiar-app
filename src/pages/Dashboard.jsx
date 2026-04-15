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

  const [transMes, setTransMes] = useState([]);
  const [transAno, setTransAno] = useState([]);
  const [categorias, setCategorias] = useState([]);

  useEffect(() => {
    carregarDados();
  }, [mes, ano]);

  async function carregarDados() {
    const mesStr = String(mes).padStart(2, "0");
    const proximoMes = String(mes + 1).padStart(2, "0");

    // 🔹 Transações do mês
    const { data: transM } = await supabase
      .from("transactions")
      .select("*")
      .filter("date", "gte", `${ano}-${mesStr}-01`)
      .filter("date", "lt", `${ano}-${proximoMes}-01`);

    // 🔹 Transações do ano inteiro
    const { data: transA } = await supabase
      .from("transactions")
      .select("*")
      .filter("date", "gte", `${ano}-01-01`)
      .filter("date", "lt", `${ano + 1}-01-01`);

    const { data: cat } = await supabase.from("categories").select("*");

    setTransMes(transM || []);
    setTransAno(transA || []);
    setCategorias(cat || []);
  }

  // 🔹 Saídas do mês
  const saidasMes = transMes.filter((t) => t.type === "saida");

  // 🔹 Saídas do ano
  const saidasAno = transAno.filter((t) => t.type === "saida");

  // 🔹 Totais por categoria (mês)
  const categoriasMensal = categorias.map((cat) => {
    const total = saidasMes
      .filter((s) => s.category_id === cat.id)
      .reduce((acc, s) => acc + Number(s.amount), 0);

    return { nome: cat.name, total };
  });

  // 🔹 Totais por categoria (ano)
  const categoriasAcumulado = categorias.map((cat) => {
    const total = saidasAno
      .filter((s) => s.category_id === cat.id)
      .reduce((acc, s) => acc + Number(s.amount), 0);

    return { nome: cat.name, total };
  });

  // 🔹 Gráfico por categoria (mês)
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

      {/* QUADRO ESTILO EXCEL */}
      <div className="tabela-categorias">
        <h3>Despesas por Categoria (Estilo Excel)</h3>

        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ background: "#222" }}>
              <th style={{ padding: "10px", border: "1px solid #444" }}>Categoria</th>
              <th style={{ padding: "10px", border: "1px solid #444" }}>Total Mês (€)</th>
              <th style={{ padding: "10px", border: "1px solid #444" }}>Acumulado Ano (€)</th>
            </tr>
          </thead>

          <tbody>
            {categorias.map((cat) => {
              const mensal = categoriasMensal.find((c) => c.nome === cat.name)?.total || 0;
              const acumulado = categoriasAcumulado.find((c) => c.nome === cat.name)?.total || 0;

              return (
                <tr key={cat.id}>
                  <td style={{ padding: "10px", border: "1px solid #444" }}>{cat.name}</td>
                  <td style={{ padding: "10px", border: "1px solid #444" }}>
                    {mensal.toFixed(2)} €
                  </td>
                  <td style={{ padding: "10px", border: "1px solid #444" }}>
                    {acumulado.toFixed(2)} €
                  </td>
                </tr>
              );
            })}
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
