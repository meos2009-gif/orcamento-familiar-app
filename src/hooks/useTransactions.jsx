import { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";
import { useAuth } from "../context/AuthContext";

export function useTransactions() {
  const { user } = useAuth();
  const [transactions, setTransactions] = useState([]);

  async function load() {
    if (!user) return;

    const { data, error } = await supabase
      .from("transactions")
      .select("*")
      .eq("user_id", user.id)
      .order("date", { ascending: false });

    if (!error) {
      setTransactions(data);
    } else {
      console.error("Erro ao carregar transações:", error);
    }
  }

  useEffect(() => {
    load();
  }, [user]);

  return { transactions, reload: load };
}
