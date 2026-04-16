import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Sidebar from "./components/Sidebar";
import Navbar from "./components/Navbar";

import Dashboard from "./pages/Dashboard";
import Receitas from "./pages/Receitas";
import Despesas from "./pages/Despesas";
import Categorias from "./pages/Categorias";

import "./App.css";

export default function App() {
  return (
    <Router>
      <div className="app-layout">

        <Sidebar />
        <Navbar />

        <main className="conteudo">
          <Routes>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/receitas" element={<Receitas />} />
            <Route path="/despesas" element={<Despesas />} />
            <Route path="/categorias" element={<Categorias />} />
            <Route path="*" element={<Dashboard />} />
          </Routes>
        </main>

      </div>
    </Router>
  );
}
