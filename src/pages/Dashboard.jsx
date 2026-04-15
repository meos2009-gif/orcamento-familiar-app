import { useState, useEffect } from "react";
import { supabase } from "../supabaseClient";
import { useAuth } from "../context/AuthContext";

export default function Dashboard() {
  const { user } = useAuth();

  const [entradas, setEntradas] = useState(0);
  const [saidas, setSaidas] = useState(0);

  async function loadResumo() {
    const { data: entradasData } = await supabase
      .from("transactions")
      .select("amount")
      .eq("type", "entrada")
      .eq("user_id", user.id);

    const { data: saidasData } = await supabase
      .from("transactions")
      .select("amount")
      .eq("type", "saida")
      .eq("user_id", user.id);

    setEntradas(entradasData?.reduce((acc, i) => acc + i.amount, 0) || 0);
    setSaidas(saidasData?.reduce((acc, i) => acc + i.amount, 0) || 0);
  }

  useEffect(() => {
    if (user) loadResumo();
  }, [user]);

  return (
    <div className="page">
      <h1>Dashboard</h1>

      <div className="card">
        <h2>Resumo</h2>

        <p>Entradas: <strong>{entradas}€</strong></p>
        <p>Saídas: <strong>{saidas}€</strong></p>
        <p>Saldo: <strong>{entradas - saidas}€</strong></p>
      </div>
    </div>
  );
}
