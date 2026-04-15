import { useState } from "react";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import "./AppLayout.css";

export default function AppLayout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="layout">
      <Navbar onToggleSidebar={() => setSidebarOpen(!sidebarOpen)} />

      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <main className="main-content">
        {children}
      </main>
    </div>
  );
}
