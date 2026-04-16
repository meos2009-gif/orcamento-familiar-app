import { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";

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

  // 🔹 Totais do mês
  const entradasMes = transMes
    .filter((t) => t.type === "entrada")
    .reduce((acc, t) => acc + Number(t.amount), 0);

  const saidasMes = transMes
    .filter((t) => t.type === "saida")
    .reduce((acc, t) => acc + Number(t.amount), 0);

  const saldoMes = entradasMes - saidasMes;

  // 🔹 Totais do ano
  const entradasAno = transAno
    .filter((t) => t.type === "entrada")
    .reduce((acc, t) => acc + Number(t.amount), 0);

  const saidasAno = transAno
    .filter((t) => t.type === "saida")
    .reduce((acc, t) => acc + Number(t.amount), 0);

  const saldoAno = entradasAno - saidasAno;

  // 🔹 Total de despesas do mês (para percentagens)
  const totalDespesasMes = saidasMes;

  // 🔹 Totais por categoria (mês) + percentagens
  const categoriasMensal = categorias.map((cat) => {
    const total = transMes
      .filter((t) => t.type === "saida" && t.category_id === cat.id)
      .reduce((acc, t) => acc + Number(t.amount), 0);

    const percent = totalDespesasMes > 0 ? (total / totalDespesasMes) * 100 : 0;

    return {
      nome: cat.name,
      total,
      percent,
    };
  });

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

      {/* QUADRO ESTILO EXCEL — TOTAIS */}
      <div className="tabela-categorias">
        <h3>Totais de Receitas e Despesas</h3>

        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ background: "#222" }}>
              <th style={{ padding: "10px", border: "1px solid #444" }}>Descrição</th>
              <th style={{ padding: "10px", border: "1px solid #444" }}>Total Mês (€)</th>
              <th style={{ padding: "10px", border: "1px solid #444" }}>Acumulado Ano (€)</th>
              <th style={{ padding: "10px", border: "1px solid #444" }}>Saldo Mês (€)</th>
              <th style={{ padding: "10px", border: "1px solid #444" }}>Saldo Ano (€)</th>
            </tr>
          </thead>

          <tbody>
            <tr>
              <td style={{ padding: "10px", border: "1px solid #444" }}>Receitas</td>

              <td
                style={{
                  padding: "10px",
                  border: "1px solid #444",
                  color: entradasMes > 0 ? "lightgreen" : "white",
                }}
              >
                {entradasMes.toFixed(2)} €
              </td>

              <td
                style={{
                  padding: "10px",
                  border: "1px solid #444",
                  color: entradasAno > 0 ? "lightgreen" : "white",
                }}
              >
                {entradasAno.toFixed(2)} €
              </td>

              <td style={{ padding: "10px", border: "1px solid #444" }}>—</td>
              <td style={{ padding: "10px", border: "1px solid #444" }}>—</td>
            </tr>

            <tr>
              <td style={{ padding: "10px", border: "1px solid #444" }}>Despesas</td>

              <td
                style={{
                  padding: "10px",
                  border: "1px solid #444",
                  color: saidasMes > 0 ? "red" : "white",
                }}
              >
                {saidasMes.toFixed(2)} €
              </td>

              <td
                style={{
                  padding: "10px",
                  border: "1px solid #444",
                  color: saidasAno > 0 ? "red" : "white",
                }}
              >
                {saidasAno.toFixed(2)} €
              </td>

              <td style={{ padding: "10px", border: "1px solid #444" }}>—</td>
              <td style={{ padding: "10px", border: "1px solid #444" }}>—</td>
            </tr>

            <tr style={{ background: "#111" }}>
              <td style={{ padding: "10px", border: "1px solid #444" }}><b>Saldo</b></td>

              <td style={{ padding: "10px", border: "1px solid #444" }}>—</td>
              <td style={{ padding: "10px", border: "1px solid #444" }}>—</td>

              <td
                style={{
                  padding: "10px",
                  border: "1px solid #444",
                  color: saldoMes > 0 ? "lightgreen" : "red",
                  fontWeight: "bold",
                }}
              >
                {saldoMes.toFixed(2)} €
              </td>

              <td
                style={{
                  padding: "10px",
                  border: "1px solid #444",
                  color: saldoAno > 0 ? "lightgreen" : "red",
                  fontWeight: "bold",
                }}
              >
                {saldoAno.toFixed(2)} €
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* QUADRO DESPESAS POR CATEGORIA */}
      <div className="tabela-categorias" style={{ marginTop: "30px" }}>
        <h3>Despesas por Categoria (Mês)</h3>

        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ background: "#222" }}>
              <th style={{ padding: "10px", border: "1px solid #444" }}>Categoria</th>
              <th style={{ padding: "10px", border: "1px solid #444" }}>Total (€)</th>
              <th style={{ padding: "10px", border: "1px solid #444" }}>% do Total</th>
            </tr>
          </thead>

          <tbody>
            {categoriasMensal.map((c) => (
              <tr key={c.nome}>
                <td style={{ padding: "10px", border: "1px solid #444" }}>{c.nome}</td>

                <td
                  style={{
                    padding: "10px",
                    border: "1px solid #444",
                    color: c.total > 0 ? "red" : "white",
                  }}
                >
                  {c.total.toFixed(2)} €
                </td>

                <td
                  style={{
                    padding: "10px",
                    border: "1px solid #444",
                    color: c.percent > 0 ? "orange" : "white",
                  }}
                >
                  {c.percent.toFixed(1)}%
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
