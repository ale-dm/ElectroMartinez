const API = "http://localhost:4000/api";

export async function getCategories(token?: string) {
  const res = await fetch(`${API}/categories`, {
    headers: token ? { Authorization: `Bearer ${token}` } : undefined,
  });
  if (!res.ok) throw new Error("Error al obtener categorías");
  return res.json();
}
