import { BrowserRouter, Routes, Route } from "react-router-dom";

import MainLayout from "./layouts/MainLayout";
import Servicios from "./components/Servicios";
import AdminRoute from "./components/AdminRoute";
import AdminLayout from "./pages/admin/AdminLayout";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminProductos from "./pages/admin/AdminProductos";
import AdminUsuarios from "./pages/admin/AdminUsuarios";
import AdminReparaciones from "./pages/admin/AdminReparaciones";
import LoginPage from "./pages/LoginPage";

function Home() {
  return (
    <div className="w-full min-h-[80vh] flex flex-col gap-16 items-center justify-center">
      {/* Hero principal */}
      <section className="w-full flex flex-col items-center justify-center gap-4 py-8 md:py-16">
        <h1 className="text-4xl md:text-5xl font-bold text-brand-dark mb-4">ElectroMartínez</h1>
        <p className="text-xl md:text-2xl text-brand-yellow font-semibold mb-2">Venta y reparación de electrodomésticos</p>
        <p className="text-lg text-brand-dark mb-4">Instalaciones eléctricas · Iluminación LED · Aire acondicionado</p>
        <a href="/reparaciones" className="inline-block bg-brand-yellow text-brand-dark px-6 py-3 rounded-full font-bold shadow hover:bg-yellow-400 transition-colors duration-200">Solicita tu reparación</a>
      </section>
      {/* Servicios destacados */}
      <Servicios />
    </div>
  );
}
function Catalogo() {
  return <div>Catálogo de productos</div>;
}
function Reparaciones() {
  return <div>Solicitudes de reparación</div>;
}
function Contacto() {
  return <div>Formulario de contacto</div>;
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<MainLayout />}>
          <Route index element={<Home />} />
          <Route path="catalogo" element={<Catalogo />} />
          <Route path="reparaciones" element={<Reparaciones />} />
          <Route path="contacto" element={<Contacto />} />
          <Route path="login" element={<LoginPage />} />
        </Route>
        {/* Rutas protegidas de admin */}
        <Route element={<AdminRoute />}>
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<AdminDashboard />} />
            <Route path="productos" element={<AdminProductos />} />
            <Route path="usuarios" element={<AdminUsuarios />} />
            <Route path="reparaciones" element={<AdminReparaciones />} />
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
