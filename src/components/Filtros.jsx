export default function Filtros({ mes, ano, setMes, setAno }) {
  return (
    <div className="filtros">
      <select value={mes} onChange={(e) => setMes(e.target.value)}>
        <option value="">Todos os meses</option>
        <option value="01">Janeiro</option>
        <option value="02">Fevereiro</option>
        <option value="03">Março</option>
        <option value="04">Abril</option>
        <option value="05">Maio</option>
        <option value="06">Junho</option>
        <option value="07">Julho</option>
        <option value="08">Agosto</option>
        <option value="09">Setembro</option>
        <option value="10">Outubro</option>
        <option value="11">Novembro</option>
        <option value="12">Dezembro</option>
      </select>

      <select value={ano} onChange={(e) => setAno(e.target.value)}>
        <option value="">Todos os anos</option>
        <option value="2024">2024</option>
        <option value="2025">2025</option>
        <option value="2026">2026</option>
      </select>
    </div>
  );
}
