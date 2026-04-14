import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";

export default function AppLayout({ children }) {
  return (
    <div className="layout">
      <Sidebar />

      <div className="layout-content">
        <Navbar />
        <main>{children}</main>
      </div>
    </div>
  );
}
