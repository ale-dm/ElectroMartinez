// Script de prueba para endpoints principales del backend
const axios = require('axios');

const API = 'http://localhost:4000/api';
const admin = { email: 'admin@email.com', password: 'admin123' };
let token = '';

async function login() {
  const res = await axios.post(`${API}/auth/login`, admin);
  token = res.data.token;
  console.log('Login OK:', token);
}

async function crearUsuario() {
  const res = await axios.post(`${API}/users`, {
    nombre: 'Test User',
    email: 'testuser@email.com',
    password: '123456'
  }, { headers: { Authorization: `Bearer ${token}` } });
  console.log('Usuario creado:', res.data);
}

async function crearProducto() {
  const res = await axios.post(`${API}/products`, {
    nombre: 'Producto Test',
    descripcion: 'Desc de prueba',
    categoria: 'Electro',
    precio: 1000
  }, { headers: { Authorization: `Bearer ${token}` } });
  console.log('Producto creado:', res.data);
  return res.data._id;
}

async function crearReparacion(productoId) {
  const res = await axios.post(`${API}/repairs`, {
    productoId,
    descripcion: 'Falla de prueba'
  }, { headers: { Authorization: `Bearer ${token}` } });
  console.log('Reparación creada:', res.data);
}

async function crearFactura() {
  const res = await axios.post(`${API}/invoices`, {
    invoiceNumber: 'F-001',
    client: 'Cliente Prueba',
    items: [
      { descripcion: 'Servicio', cantidad: 1, precio: 500 }
    ],
    total: 500
  }, { headers: { Authorization: `Bearer ${token}` } });
  console.log('Factura creada:', res.data);
  return res.data._id;
}

async function enviarContacto() {
  const res = await axios.post(`${API}/contact`, {
    nombre: 'Contacto Test',
    email: 'contacto@email.com',
    mensaje: 'Mensaje de prueba'
  });
  console.log('Mensaje de contacto enviado:', res.data);
}

async function main() {
  try {
    await login();
    await crearUsuario();
    const productoId = await crearProducto();
    await crearReparacion(productoId);
    await crearFactura();
    await enviarContacto();
    console.log('Pruebas completadas.');
  } catch (err) {
    if (err.response) {
      console.error('Error:', err.response.data);
    } else {
      console.error('Error:', err.message);
    }
  }
}

main();
