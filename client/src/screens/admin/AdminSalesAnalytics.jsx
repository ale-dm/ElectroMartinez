import React, { useEffect, useState } from 'react';
import AdminSidebar from '../../components/admin/AdminSidebar';
import { URLDevelopment } from '../../helpers/URL';
import axios from 'axios';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';

const AdminSalesAnalytics = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [period, setPeriod] = useState('7');

  useEffect(() => {
    fetchStats();
  }, [period]);

  const fetchStats = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const res = await axios.get(`${URLDevelopment}/api/admin/sales-stats?period=${period}`, {
        headers: { 'x-auth-token': token }
      });
      setStats(res.data);
    } catch (error) {
      console.error('Error al cargar estadísticas de ventas:', error);
    } finally {
      setLoading(false);
    }
  };

  const COLORS = ['#FDB913', '#f59e0b', '#2d2d2d', '#1a1a1a', '#f97316', '#ef4444'];

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('es-ES', {
      style: 'currency',
      currency: 'EUR'
    }).format(value);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', { month: 'short', day: 'numeric' });
  };

  if (loading) {
    return (
      <div className='flex min-h-screen bg-background'>
        <AdminSidebar />
        <main className='flex-1 p-8'>
          <div className='text-center py-20'>
            <span className='material-symbols-outlined animate-spin text-primary' style={{ fontSize: '60px' }}>
              progress_activity
            </span>
            <p className='text-gray-600 mt-4'>Cargando estadísticas de ventas...</p>
          </div>
        </main>
      </div>
    );
  }

  const salesData = stats?.salesByDay?.map(item => ({
    date: formatDate(item._id),
    ventas: item.count,
    ingresos: item.revenue
  })) || [];

  const categoryData = stats?.salesByCategory?.map(item => ({
    name: item._id || 'Sin categoría',
    value: item.revenue,
    count: item.count
  })) || [];

  const currentRevenue = stats?.monthlyComparison?.current?.revenue || 0;
  const lastRevenue = stats?.monthlyComparison?.last?.revenue || 0;
  const revenueChange = lastRevenue > 0 
    ? ((currentRevenue - lastRevenue) / lastRevenue * 100).toFixed(1) 
    : 0;

  const currentOrders = stats?.monthlyComparison?.current?.count || 0;
  const lastOrders = stats?.monthlyComparison?.last?.count || 0;
  const ordersChange = lastOrders > 0 
    ? ((currentOrders - lastOrders) / lastOrders * 100).toFixed(1) 
    : 0;

  return (
    <div className='flex min-h-screen bg-background'>
      <AdminSidebar />

      <main className='flex-1 p-8'>
        {/* Header */}
        <div className='mb-8'>
          <div className='flex items-center gap-3 mb-2'>
            <span className='material-symbols-outlined text-primary' style={{ fontSize: '36px' }}>
              monitoring
            </span>
            <h1 className='text-3xl font-bold text-secondary'>Análisis de Ventas</h1>
          </div>
          <p className='text-gray-600'>Métricas y gráficas de rendimiento</p>
        </div>

        {/* Selector de Período */}
        <div className='mb-6 flex gap-2'>
          <button
            onClick={() => setPeriod('7')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              period === '7'
                ? 'bg-primary text-dark'
                : 'bg-white text-gray-700 hover:bg-gray-100'
            }`}
          >
            Últimos 7 días
          </button>
          <button
            onClick={() => setPeriod('30')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              period === '30'
                ? 'bg-primary text-dark'
                : 'bg-white text-gray-700 hover:bg-gray-100'
            }`}
          >
            Últimos 30 días
          </button>
          <button
            onClick={() => setPeriod('90')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              period === '90'
                ? 'bg-primary text-dark'
                : 'bg-white text-gray-700 hover:bg-gray-100'
            }`}
          >
            Últimos 90 días
          </button>
        </div>

        {/* Tarjetas de Resumen */}
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8'>
          {/* Total Ventas */}
          <div className='bg-white rounded-lg shadow-lg p-6'>
            <div className='flex items-center justify-between mb-2'>
              <p className='text-gray-600 text-sm'>Total Ventas</p>
              <span className='material-symbols-outlined text-blue-600'>
                shopping_cart
              </span>
            </div>
            <p className='text-3xl font-bold text-secondary mb-1'>
              {stats?.summary?.totalOrders || 0}
            </p>
            <div className='flex items-center gap-1 text-sm'>
              <span className={`${ordersChange >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {ordersChange >= 0 ? '↑' : '↓'} {Math.abs(ordersChange)}%
              </span>
              <span className='text-gray-500'>vs mes anterior</span>
            </div>
          </div>

          {/* Total Ingresos */}
          <div className='bg-white rounded-lg shadow-lg p-6'>
            <div className='flex items-center justify-between mb-2'>
              <p className='text-gray-600 text-sm'>Ingresos</p>
              <span className='material-symbols-outlined text-green-600'>
                euro_symbol
              </span>
            </div>
            <p className='text-3xl font-bold text-secondary mb-1'>
              {formatCurrency(stats?.summary?.totalRevenue || 0)}
            </p>
            <div className='flex items-center gap-1 text-sm'>
              <span className={`${revenueChange >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {revenueChange >= 0 ? '↑' : '↓'} {Math.abs(revenueChange)}%
              </span>
              <span className='text-gray-500'>vs mes anterior</span>
            </div>
          </div>

          {/* Ticket Promedio */}
          <div className='bg-white rounded-lg shadow-lg p-6'>
            <div className='flex items-center justify-between mb-2'>
              <p className='text-gray-600 text-sm'>Ticket Promedio</p>
              <span className='material-symbols-outlined text-primary'>
                receipt_long
              </span>
            </div>
            <p className='text-3xl font-bold text-secondary mb-1'>
              {formatCurrency(stats?.summary?.avgOrderValue || 0)}
            </p>
            <p className='text-sm text-gray-500'>por pedido</p>
          </div>

          {/* Mes Actual */}
          <div className='bg-white rounded-lg shadow-lg p-6'>
            <div className='flex items-center justify-between mb-2'>
              <p className='text-gray-600 text-sm'>Este Mes</p>
              <span className='material-symbols-outlined text-orange-600'>
                calendar_month
              </span>
            </div>
            <p className='text-3xl font-bold text-secondary mb-1'>
              {formatCurrency(currentRevenue)}
            </p>
            <p className='text-sm text-gray-500'>{currentOrders} pedidos</p>
          </div>
        </div>

        {/* Gráficas */}
        <div className='grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6'>
          {/* Gráfica de Ventas por Día */}
          <div className='bg-white rounded-lg shadow-lg p-6'>
            <h3 className='text-xl font-bold text-secondary mb-4'>Ventas Diarias</h3>
            <ResponsiveContainer width='100%' height={300}>
              <LineChart data={salesData}>
                <CartesianGrid strokeDasharray='3 3' />
                <XAxis dataKey='date' />
                <YAxis yAxisId='left' />
                <YAxis yAxisId='right' orientation='right' />
                <Tooltip />
                <Legend />
                <Line
                  yAxisId='left'
                  type='monotone'
                  dataKey='ventas'
                  stroke='#FDB913'
                  strokeWidth={2}
                  name='Número de Ventas'
                />
                <Line
                  yAxisId='right'
                  type='monotone'
                  dataKey='ingresos'
                  stroke='#2d2d2d'
                  strokeWidth={2}
                  name='Ingresos (€)'
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Gráfica de Ventas por Categoría */}
          <div className='bg-white rounded-lg shadow-lg p-6'>
            <h3 className='text-xl font-bold text-secondary mb-4'>Ventas por Categoría</h3>
            <ResponsiveContainer width='100%' height={300}>
              <PieChart>
                <Pie
                  data={categoryData}
                  cx='50%'
                  cy='50%'
                  labelLine={false}
                  label={(entry) => `${entry.name}: ${formatCurrency(entry.value)}`}
                  outerRadius={100}
                  fill='#8884d8'
                  dataKey='value'
                >
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => formatCurrency(value)} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Top 5 Productos Más Vendidos */}
        <div className='bg-white rounded-lg shadow-lg p-6'>
          <div className='flex items-center gap-2 mb-4'>
            <span className='material-symbols-outlined text-primary' style={{ fontSize: '28px' }}>
              emoji_events
            </span>
            <h3 className='text-xl font-bold text-secondary'>Top 5 Productos Más Vendidos</h3>
          </div>
          <ResponsiveContainer width='100%' height={300}>
            <BarChart data={stats?.topProducts || []}>
              <CartesianGrid strokeDasharray='3 3' />
              <XAxis dataKey='name' />
              <YAxis yAxisId='left' />
              <YAxis yAxisId='right' orientation='right' />
              <Tooltip />
              <Legend />
              <Bar yAxisId='left' dataKey='quantity' fill='#FDB913' name='Unidades Vendidas' />
              <Bar yAxisId='right' dataKey='revenue' fill='#2d2d2d' name='Ingresos (€)' />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Tabla de Categorías */}
        <div className='bg-white rounded-lg shadow-lg p-6 mt-6'>
          <h3 className='text-xl font-bold text-secondary mb-4'>Detalle por Categoría</h3>
          <div className='overflow-x-auto'>
            <table className='w-full'>
              <thead>
                <tr className='border-b'>
                  <th className='text-left py-3 px-4 text-secondary'>Categoría</th>
                  <th className='text-right py-3 px-4 text-secondary'>Unidades</th>
                  <th className='text-right py-3 px-4 text-secondary'>Ingresos</th>
                  <th className='text-right py-3 px-4 text-secondary'>% del Total</th>
                </tr>
              </thead>
              <tbody>
                {categoryData.map((cat, index) => {
                  const percentage = ((cat.value / stats?.summary?.totalRevenue) * 100).toFixed(1);
                  return (
                    <tr key={index} className='border-b hover:bg-gray-50'>
                      <td className='py-3 px-4 font-medium'>{cat.name}</td>
                      <td className='text-right py-3 px-4'>{cat.count}</td>
                      <td className='text-right py-3 px-4 font-bold text-secondary'>
                        {formatCurrency(cat.value)}
                      </td>
                      <td className='text-right py-3 px-4'>
                        <span className='bg-primary text-dark px-2 py-1 rounded-full text-sm font-medium'>
                          {percentage}%
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminSalesAnalytics;
