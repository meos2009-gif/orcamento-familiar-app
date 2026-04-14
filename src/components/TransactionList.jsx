import { supabase } from "../supabaseClient";

export default function TransactionList({ items }) {
  async function deleteItem(id) {
    await supabase.from("transactions").delete().eq("id", id);
  }

  return (
    <div>
      <h3>Lista</h3>

      {items.length === 0 && <p>Nenhum registo encontrado.</p>}

      <ul>
        {items.map((t) => (
          <li key={t.id} style={{ marginBottom: "10px" }}>
            <strong>{t.description}</strong> — {t.amount}€
            <br />
            <small>{t.date}</small>
            <br />
            <button onClick={() => deleteItem(t.id)}>Apagar</button>
          </li>
        ))}
      </ul>
    </div>
  );
}
