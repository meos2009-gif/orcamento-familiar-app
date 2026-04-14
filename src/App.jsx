import { BrowserRouter, Routes, Route } from "react-router-dom";
import AppLayout from "./layout/AppLayout";

import Dashboard from "./pages/Dashboard";
import Entradas from "./pages/Entradas";
import Saidas from "./pages/Saidas";
import Categorias from "./pages/Categorias";

import Login from "./pages/Login";
import { AuthProvider } from "./context/AuthContext";
import PrivateRoute from "./components/PrivateRoute";

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>

          <Route path="/login" element={<Login />} />

          <Route
            path="/"
            element={
              <PrivateRoute>
                <AppLayout>
                  <Dashboard />
                </AppLayout>
              </PrivateRoute>
            }
          />

          <Route
            path="/entradas"
            element={
              <PrivateRoute>
                <AppLayout>
                  <Entradas />
                </AppLayout>
              </PrivateRoute>
            }
          />

          <Route
            path="/saidas"
            element={
              <PrivateRoute>
                <AppLayout>
                  <Saidas />
                </AppLayout>
              </PrivateRoute>
            }
          />

          <Route
            path="/categorias"
            element={
              <PrivateRoute>
                <AppLayout>
                  <Categorias />
                </AppLayout>
              </PrivateRoute>
            }
          />

        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
