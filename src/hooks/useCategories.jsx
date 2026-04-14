import { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";
import { useAuth } from "../context/AuthContext";

export function useCategories() {
  const { user } = useAuth();
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    if (!user) return;

    async function load() {
      const { data, error } = await supabase
        .from("categories")
        .select("*")
        .eq("user_id", user.id)
        .order("name", { ascending: true });

      if (!error) setCategories(data);
    }

    load();
  }, [user]);

  return { categories };
}
