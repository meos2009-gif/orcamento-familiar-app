import { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";
import { useAuth } from "../context/AuthContext";
import Filtros from "../components/Filtros";

export default function Dashboard() {
  const { user } = useAuth();

  const [mes, setMes] = useState("");
  const [ano, setAno] = useState("");
  const [categoriaFiltro, setCategoriaFiltro] = useState("");

  const [categorias, setCategorias] = useState([]);

  const [totalEntradas, setTotalEntradas] = useState(0);
  const [totalSaidas, setTotalSaidas] = useState(0);
  const [ultimas, setUltimas] = useState([]);

  // ----------------------------------------
  // CARREGAR CATEGORIAS
  // ----------------------------------------
  async function loadCategorias() {
    const { data } = await supabase
      .from("categories")
      .select("*")
      .eq("user_id", user.id)
      .order("name", { ascending: true });

    setCategorias(data || []);
  }

  // ----------------------------------------
  // CARREGAR DADOS DO DASHBOARD
  // ----------------------------------------
  async function loadDashboard() {
    let queryEntradas = supabase
      .from("transactions")
      .select("*")
      .eq("type", "entrada")
      .eq("user_id", user.id);

    let querySaidas = supabase
      .from("transactions")
      .select("*")
      .eq("type", "saida")
      .eq("user_id", user.id);

    let queryUltimas = supabase
      .from("transactions")
      .select("*")
      .eq("user_id", user.id)
      .order("date", { ascending: false });

    // FILTRO ANO
    if (ano) {
      queryEntradas = queryEntradas.like("date", `${ano}-%`);
      querySaidas = querySaidas.like("date", `${ano}-%`);
      queryUltimas = queryUltimas.like("date", `${ano}-%`);
    }

    // FILTRO MÊS
    if (mes) {
      queryEntradas = queryEntradas.like("date", `%-${mes}-%`);
      querySaidas = querySaidas.like("date", `%-${mes}-%`);
      queryUltimas = queryUltimas.like("date", `%-${mes}-%`);
    }

    // FILTRO CATEGORIA
    if (categoriaFiltro) {
      queryEntradas = queryEntradas.eq("category_id", categoriaFiltro);
      querySaidas = querySaidas.eq("category_id", categoriaFiltro);
      queryUltimas = queryUltimas.eq("category_id", categoriaFiltro);
    }

    const { data: e } = await queryEntradas;
    const { data: s } = await querySaidas;
    const { data: u } = await queryUltimas.limit(5);

    setTotalEntradas(e?.reduce((acc, i) => acc + i.amount, 0) || 0);
    setTotalSaidas(s?.reduce((acc, i) => acc + i.amount, 0) || 0);
    setUltimas(u || []);
  }

  useEffect(() => {
    if (user) {
      loadCategorias();
      loadDashboard();
    }
  }, [user, mes, ano, categoriaFiltro]);

  return (
    <div>
      <h1>Dashboard</h1>

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

      {/* RESUMO */}
      <div className="card">
        <h2>Resumo</h2>

        <div className="dashboard-grid">
          <div className="dash-box entrada">
            <h3>Total Entradas</h3>
            <p>{totalEntradas} €</p>
          </div>

          <div className="dash-box saida">
            <h3>Total Saídas</h3>
            <p>{totalSaidas} €</p>
          </div>

          <div className="dash-box saldo">
            <h3>Saldo</h3>
            <p>{totalEntradas - totalSaidas} €</p>
          </div>
        </div>
      </div>

      {/* ÚLTIMAS TRANSAÇÕES */}
      <div className="card">
        <h2>Últimas Transações</h2>

        {ultimas.length === 0 ? (
          <p className="empty">Nenhum registo encontrado.</p>
        ) : (
          <table className="table">
            <thead>
              <tr>
                <th>Descrição</th>
                <th>Valor</th>
                <th>Data</th>
                <th>Categoria</th>
                <th>Tipo</th>
              </tr>
            </thead>

            <tbody>
              {ultimas.map((item) => (
                <tr key={item.id}>
                  <td>{item.description}</td>

                  <td className={item.type === "entrada" ? "valor entrada" : "valor saida"}>
                    {item.type === "entrada" ? "+" : "-"} {item.amount} €
                  </td>

                  <td>{item.date}</td>

                  <td>
                    {categorias.find((c) => c.id === item.category_id)?.name || "-"}
                  </td>

                  <td>{item.type}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
