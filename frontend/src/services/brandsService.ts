const API = "http://localhost:4000/api";

export async function getBrands(token?: string) {
  const res = await fetch(`${API}/brands`, {
    headers: token ? { Authorization: `Bearer ${token}` } : undefined,
  });
  if (!res.ok) throw new Error("Error al obtener marcas");
  return res.json();
}
