// import type { Product } from "../components/ProductTable"; // No es necesario si no se usa en runtime

const API = "http://localhost:4000/api";

export async function getProducts(page = 1, limit = 10, token?: string) {
  const res = await fetch(`${API}/products?page=${page}&limit=${limit}`, {
    headers: token ? { Authorization: `Bearer ${token}` } : undefined,
  });
  if (!res.ok) throw new Error("Error al obtener productos");
  return res.json();
}

export async function createProduct(data: any, token: string) {
  const formData = new FormData();
  for (const key in data) {
    if (key === "imagenes" && Array.isArray(data.imagenes)) {
      data.imagenes.forEach((img: File | string) => {
        if (img instanceof File) formData.append("imagenes", img);
      });
    } else {
      formData.append(key, data[key]);
    }
  }
  const res = await fetch(`${API}/products`, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}` },
    body: formData,
  });
  if (!res.ok) throw new Error("Error al crear producto");
  return res.json();
}

export async function updateProduct(id: string, data: any, token: string) {
  const formData = new FormData();
  for (const key in data) {
    if (key === "imagenes" && Array.isArray(data.imagenes)) {
      data.imagenes.forEach((img: File | string) => {
        if (img instanceof File) formData.append("imagenes", img);
      });
    } else {
      formData.append(key, data[key]);
    }
  }
  const res = await fetch(`${API}/products/${id}`, {
    method: "PUT",
    headers: { Authorization: `Bearer ${token}` },
    body: formData,
  });
  if (!res.ok) throw new Error("Error al actualizar producto");
  return res.json();
}

export async function deleteProduct(id: string, token: string) {
  const res = await fetch(`${API}/products/${id}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error("Error al eliminar producto");
  return res.json();
}
