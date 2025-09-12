// Servicio de autenticación para login
// Devuelve un token JWT si las credenciales son correctas

export async function loginService(email: string, password: string): Promise<string> {
  // Usa la URL real del backend
  const API = "http://localhost:4000/api";
  let res: Response;
  try {
    res = await fetch(`${API}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password })
    });
  } catch (err) {
    throw new Error("No se pudo conectar con el servidor");
  }
  let data: any = {};
  try {
    data = await res.json();
  } catch {
    // Si la respuesta no es JSON
    throw new Error("Respuesta inesperada del servidor");
  }
  if (!res.ok) {
    throw new Error(data.message || "Credenciales incorrectas");
  }
  if (!data.token) {
    throw new Error("No se recibió token de autenticación");
  }
  return data.token;
}
