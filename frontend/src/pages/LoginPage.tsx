import React, { useState } from "react";
import { useNavigate, Navigate } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";
import { loginService } from "../services/authService";

export default function LoginPage() {
  const { user, login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  if (user) return <Navigate to="/" replace />;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const token = await loginService(form.email, form.password);
      login(token);
      navigate("/admin", { replace: true });
    } catch (err: any) {
      setError(err.message || "Error de autenticación");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center bg-gradient-to-br from-brand-dark via-brand-yellow/10 to-white py-12">
      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-xl shadow-2xl p-8 w-full max-w-md flex flex-col gap-6 border border-brand-yellow/30"
      >
        <h2 className="text-2xl font-bold text-brand-dark mb-2 text-center">Iniciar sesión</h2>
        <div className="flex flex-col gap-2">
          <label htmlFor="email" className="text-brand-dark font-semibold">
            Email
          </label>
          <input
            id="email"
            name="email"
            type="email"
            autoComplete="username"
            required
            value={form.email}
            onChange={handleChange}
            className="px-4 py-2 rounded border border-brand-yellow/40 focus:outline-none focus:ring-2 focus:ring-brand-yellow/40"
            placeholder="correo@ejemplo.com"
          />
        </div>
        <div className="flex flex-col gap-2">
          <label htmlFor="password" className="text-brand-dark font-semibold">
            Contraseña
          </label>
          <input
            id="password"
            name="password"
            type="password"
            autoComplete="current-password"
            required
            value={form.password}
            onChange={handleChange}
            className="px-4 py-2 rounded border border-brand-yellow/40 focus:outline-none focus:ring-2 focus:ring-brand-yellow/40"
            placeholder="••••••••"
          />
        </div>
        {error && <div className="text-red-600 text-sm text-center">{error}</div>}
        <button
          type="submit"
          disabled={loading}
          className="bg-gradient-to-r from-yellow-400 to-brand-yellow text-brand-dark px-6 py-2 rounded font-bold shadow-lg hover:from-yellow-300 hover:to-yellow-400 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-brand-yellow/60 disabled:opacity-60"
        >
          {loading ? "Entrando..." : "Entrar"}
        </button>
      </form>
    </div>
  );
}
