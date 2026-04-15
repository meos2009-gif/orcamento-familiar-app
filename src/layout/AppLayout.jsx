import Navbar from "../components/Navbar";

export default function AppLayout({ children }) {
  return (
    <div className="app-layout">
      <Navbar />

      <main className="main-content">
        {children}
      </main>
    </div>
  );
}
