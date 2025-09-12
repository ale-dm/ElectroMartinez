
import { Link, NavLink } from "react-router-dom";
import CategoriesSubmenu from "./CategoriesSubmenu";
import { useAuth } from "../auth/AuthContext";
import { useState } from "react";

import React from "react";



export default function Navbar() {
  const { user, logout } = useAuth();
  const [open, setOpen] = useState(false);

  return (
    <>
  <nav className="w-full bg-brand-dark/90 backdrop-blur-md shadow-xl flex items-center justify-end px-8 py-4 border-b-4 border-brand-yellow relative z-30 transition-all duration-300">
  <div className="flex items-center gap-4 mr-auto">
          <Link to="/">
            <img src="/logo-electromartinez.png" alt="ElectroMartínez" className="h-12 drop-shadow-lg" />
          </Link>
        </div>
        {/* Desktop menu */}
  <div className="hidden md:flex items-center gap-12">
          <NavLinkItem to="/catalogo" isCatalogo>
            Catálogo
          </NavLinkItem>
          <NavLinkItem to="/reparaciones">Reparaciones</NavLinkItem>
          <NavLinkItem to="/contacto">Contacto</NavLinkItem>
          {user?.rol === "admin" && (
            <NavLinkItem to="/admin">Admin</NavLinkItem>
          )}
        </div>
  <div className="hidden md:flex items-center gap-6 ml-8">
          {user ? (
            <>
              <span className="text-white font-semibold text-base tracking-wide px-2">{user.nombre}</span>
              <button
                onClick={logout}
                className="bg-gradient-to-r from-yellow-400 to-brand-yellow text-brand-dark px-5 py-2 rounded font-bold shadow-lg hover:from-yellow-300 hover:to-yellow-400 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-brand-yellow/60"
              >
                Logout
              </button>
            </>
          ) : (
            <Link
              to="/login"
              className="bg-gradient-to-r from-yellow-400 to-brand-yellow text-brand-dark px-5 py-2 rounded font-bold shadow-lg hover:from-yellow-300 hover:to-yellow-400 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-brand-yellow/60"
            >
              Login
            </Link>
          )}
        </div>
        {/* Hamburger icon for mobile */}
        <button
          className="md:hidden flex flex-col justify-center items-center w-11 h-11 text-brand-yellow focus:outline-none ml-2 rounded-full bg-brand-dark/70 shadow-lg hover:bg-brand-yellow/20 transition-all duration-200"
          onClick={() => setOpen((v) => !v)}
          aria-label="Abrir menú"
        >
          <span className={`block w-7 h-1 bg-brand-yellow rounded transition-all duration-300 ${open ? 'rotate-45 translate-y-2' : ''}`}></span>
          <span className={`block w-7 h-1 bg-brand-yellow rounded my-1 transition-all duration-300 ${open ? 'opacity-0' : ''}`}></span>
          <span className={`block w-7 h-1 bg-brand-yellow rounded transition-all duration-300 ${open ? '-rotate-45 -translate-y-2' : ''}`}></span>
        </button>
        {/* Mobile drawer */}
        <div
          className={`fixed top-0 right-0 h-full w-72 bg-brand-dark/95 backdrop-blur-lg shadow-2xl z-40 transform transition-transform duration-300 ${open ? 'translate-x-0' : 'translate-x-full'}`}
          style={{ boxShadow: open ? '0 0 0 9999px rgba(0,0,0,0.4)' : 'none' }}
          onClick={() => setOpen(false)}
        >
          <div className="flex flex-col h-full p-8 gap-8" onClick={e => e.stopPropagation()}>
            <button
              className="self-end text-brand-yellow text-3xl mb-4 focus:outline-none hover:text-yellow-300 transition-all duration-200"
              onClick={() => setOpen(false)}
              aria-label="Cerrar menú"
            >
              ×
            </button>
            <NavLinkItem to="/catalogo" noUnderline isCatalogo onClick={() => setOpen(false)}>
              <span className="text-brand-yellow font-semibold text-lg tracking-wide">Catálogo</span>
            </NavLinkItem>
            <NavLinkItem to="/reparaciones" onClick={() => setOpen(false)}>
              <span className="text-brand-yellow font-semibold text-lg tracking-wide">Reparaciones</span>
            </NavLinkItem>
            <NavLinkItem to="/contacto" onClick={() => setOpen(false)}>
              <span className="text-brand-yellow font-semibold text-lg tracking-wide">Contacto</span>
            </NavLinkItem>
            {user?.rol === "admin" && (
              <NavLinkItem to="/admin" onClick={() => setOpen(false)}>
                <span className="text-brand-yellow font-semibold text-lg tracking-wide">Admin</span>
              </NavLinkItem>
            )}
            {user ? (
              <div className="flex flex-col gap-4 mt-4">
                <span className="text-white font-semibold text-base tracking-wide px-2">{user.nombre}</span>
                <button
                  onClick={() => { logout(); setOpen(false); }}
                  className="bg-gradient-to-r from-yellow-400 to-brand-yellow text-brand-dark px-5 py-2 rounded font-bold shadow-lg hover:from-yellow-300 hover:to-yellow-400 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-brand-yellow/60"
                >
                  Logout
                </button>
              </div>
            ) : (
              <Link
                to="/login"
                onClick={() => setOpen(false)}
                className="bg-gradient-to-r from-yellow-400 to-brand-yellow text-brand-dark px-5 py-2 rounded font-bold shadow-lg hover:from-yellow-300 hover:to-yellow-400 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-brand-yellow/60"
              >
                Login
              </Link>
            )}
          </div>
        </div>
        {/* Overlay for mobile menu */}
        {open && (
          <div className="fixed inset-0 z-30 bg-black bg-opacity-40" onClick={() => setOpen(false)} />
        )}
      </nav>
      <CategoriesSubmenu />
    </>
  );
}

type NavLinkItemProps = {
  to: string;
  children: React.ReactNode;
  onClick?: () => void;
  noUnderline?: boolean;
  exact?: boolean;
  isCatalogo?: boolean;
};

function NavLinkItem({ to, children, onClick, noUnderline, exact = true, isCatalogo = false }: NavLinkItemProps) {
  // For Catálogo, use a custom isActive function to match any /catalogo* route
  const isActiveFn = isCatalogo
    ? (match: any, location: any) => location.pathname.startsWith('/catalogo')
    : undefined;
  return (
    <NavLink
      to={to}
      onClick={onClick}
      className={({ isActive }) =>
        `relative font-medium text-base px-2 py-1 transition-colors duration-200 group ${
          isActive
            ? 'text-brand-yellow font-bold'
            : 'text-brand-yellow hover:text-white'
        } ${noUnderline ? '' : ''}`
      }
      {...(isCatalogo ? { isActive: isActiveFn } : exact ? { end: true } : {})}
    >
      {({ isActive }) => (
        <>
          <span className="relative z-10">{children}</span>
          {!noUnderline && (
            <span
              className={
                `absolute left-0 bottom-0 w-full h-0.5 bg-brand-yellow transition-transform origin-left duration-300 ` +
                (isActive ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100')
              }
            />
          )}
        </>
      )}
    </NavLink>
  );
}
