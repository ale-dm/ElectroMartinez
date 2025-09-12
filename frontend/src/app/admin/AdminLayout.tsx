import React from "react";
import { Outlet, NavLink } from "react-router-dom";

export default function AdminLayout() {
  return (
    <div className="min-h-screen flex bg-gray-100">
      {/* Sidebar */}
      <aside className="w-56 bg-brand-dark text-white flex flex-col py-8 px-4 gap-4 shadow-lg">
        <h2 className="text-xl font-bold mb-8 text-brand-yellow">Panel Admin</h2>
        <NavLink to="/admin" end className={({isActive}) => isActive ? "font-bold text-brand-yellow" : "hover:text-brand-yellow"}>Dashboard</NavLink>
        <NavLink to="/admin/productos" className={({isActive}) => isActive ? "font-bold text-brand-yellow" : "hover:text-brand-yellow"}>Productos</NavLink>
        <NavLink to="/admin/usuarios" className={({isActive}) => isActive ? "font-bold text-brand-yellow" : "hover:text-brand-yellow"}>Usuarios</NavLink>
        <NavLink to="/admin/reparaciones" className={({isActive}) => isActive ? "font-bold text-brand-yellow" : "hover:text-brand-yellow"}>Reparaciones</NavLink>
      </aside>
      {/* Main content */}
      <main className="flex-1 p-8">
        <Outlet />
      </main>
    </div>
  );
}
