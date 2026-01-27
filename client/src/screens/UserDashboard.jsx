import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import axios from 'axios';
import Container from '../components/container/Container';
import { URLDevelopment } from '../helpers/URL';

const UserDashboard = () => {
    const navigate = useNavigate();
    const { isAuthenticated, user } = useSelector(state => state.auth);
    const [orders, setOrders] = useState([]);
    const [returns, setReturns] = useState([]);
    const [loading, setLoading] = useState(true);
    const [returnsLoading, setReturnsLoading] = useState(false);
    const [activeTab, setActiveTab] = useState('orders');
    const [downloadingInvoice, setDownloadingInvoice] = useState(null);
    
    // Estados para editar perfil
    const [isEditingProfile, setIsEditingProfile] = useState(false);
    const [profileData, setProfileData] = useState({
        name: user?.name || '',
        email: user?.email || '',
        phone: user?.phone || ''
    });
    const [savingProfile, setSavingProfile] = useState(false);

    // Estados para cambiar contraseña
    const [passwordData, setPasswordData] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
    });
    const [changingPassword, setChangingPassword] = useState(false);

    useEffect(() => {
        if (!isAuthenticated) {
            navigate('/login');
            return;
        }
        fetchOrders();
    }, [isAuthenticated, navigate]);

    useEffect(() => {
        if (user) {
            setProfileData({
                name: user.name || '',
                email: user.email || '',
                phone: user.phone || ''
            });
        }
    }, [user]);

    const fetchOrders = async () => {
        try {
            const config = {
                headers: {
                    'x-auth-token': localStorage.getItem('token')
                }
            };
            const res = await axios.get(`${URLDevelopment}/api/order/user`, config);
            setOrders(res.data);
        } catch (error) {
            console.error('Error al cargar pedidos:', error);
            toast.error('Error al cargar pedidos');
        } finally {
            setLoading(false);
        }
    };

    const fetchReturns = async () => {
        setReturnsLoading(true);
        try {
            const config = {
                headers: {
                    'x-auth-token': localStorage.getItem('token')
                }
            };
            const res = await axios.get(`${URLDevelopment}/api/returns/user`, config);
            setReturns(res.data);
        } catch (error) {
            console.error('Error al cargar devoluciones:', error);
        } finally {
            setReturnsLoading(false);
        }
    };

    const handleDownloadInvoice = async (orderId, orderNumber) => {
        setDownloadingInvoice(orderId);
        try {
            const config = {
                headers: {
                    'x-auth-token': localStorage.getItem('token')
                },
                responseType: 'blob'
            };
            const res = await axios.get(`${URLDevelopment}/api/order/${orderId}/invoice`, config);
            
            // Crear blob y descargar
            const blob = new Blob([res.data], { type: 'application/pdf' });
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = `factura-${orderNumber}.pdf`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            window.URL.revokeObjectURL(url);
            
            toast.success('Factura descargada correctamente');
        } catch (error) {
            console.error('Error al descargar factura:', error);
            toast.error('Error al descargar la factura');
        } finally {
            setDownloadingInvoice(null);
        }
    };

    useEffect(() => {
        if (activeTab === 'returns' && returns.length === 0) {
            fetchReturns();
        }
    }, [activeTab]);

    const handleProfileChange = (e) => {
        setProfileData({
            ...profileData,
            [e.target.name]: e.target.value
        });
    };

    const handleSaveProfile = async (e) => {
        e.preventDefault();
        setSavingProfile(true);

        try {
            const config = {
                headers: {
                    'x-auth-token': localStorage.getItem('token'),
                    'Content-Type': 'application/json'
                }
            };

            await axios.put(`${URLDevelopment}/api/user/profile`, profileData, config);
            
            toast.success('Perfil actualizado correctamente');
            setIsEditingProfile(false);
            
            // Recargar la página para actualizar el estado global del usuario
            window.location.reload();
        } catch (error) {
            console.error('Error al actualizar perfil:', error);
            const errorMsg = error.response?.data?.error || 
                           error.response?.data?.errors?.[0]?.msg || 
                           'Error al actualizar el perfil';
            toast.error(errorMsg);
        } finally {
            setSavingProfile(false);
        }
    };

    const handlePasswordChange = (e) => {
        setPasswordData({
            ...passwordData,
            [e.target.name]: e.target.value
        });
    };

    const handleChangePassword = async (e) => {
        e.preventDefault();

        // Validar que las contraseñas coincidan
        if (passwordData.newPassword !== passwordData.confirmPassword) {
            toast.error('Las contraseñas nuevas no coinciden');
            return;
        }

        // Validar longitud mínima
        if (passwordData.newPassword.length < 6) {
            toast.error('La nueva contraseña debe tener al menos 6 caracteres');
            return;
        }

        setChangingPassword(true);

        try {
            const config = {
                headers: {
                    'x-auth-token': localStorage.getItem('token'),
                    'Content-Type': 'application/json'
                }
            };

            await axios.put(`${URLDevelopment}/api/user/change-password`, {
                currentPassword: passwordData.currentPassword,
                newPassword: passwordData.newPassword
            }, config);
            
            toast.success('Contraseña cambiada correctamente');
            
            // Limpiar formulario
            setPasswordData({
                currentPassword: '',
                newPassword: '',
                confirmPassword: ''
            });
        } catch (error) {
            console.error('Error al cambiar contraseña:', error);
            const errorMsg = error.response?.data?.error || 
                           error.response?.data?.errors?.[0]?.msg || 
                           'Error al cambiar la contraseña';
            toast.error(errorMsg);
        } finally {
            setChangingPassword(false);
        }
    };

    const getStatusBadge = (status) => {
        const statusConfig = {
            pendiente: { bg: 'bg-yellow-100', text: 'text-yellow-800', label: 'Pendiente' },
            confirmado: { bg: 'bg-blue-100', text: 'text-blue-800', label: 'Confirmado' },
            procesando: { bg: 'bg-purple-100', text: 'text-purple-800', label: 'Procesando' },
            enviado: { bg: 'bg-indigo-100', text: 'text-indigo-800', label: 'Enviado' },
            entregado: { bg: 'bg-green-100', text: 'text-green-800', label: 'Entregado' },
            cancelado: { bg: 'bg-red-100', text: 'text-red-800', label: 'Cancelado' }
        };
        const config = statusConfig[status] || statusConfig.pendiente;
        return (
            <span className={`px-3 py-1 rounded-full text-xs font-semibold ${config.bg} ${config.text}`}>
                {config.label}
            </span>
        );
    };

    const getPaymentBadge = (status) => {
        const config = {
            pendiente: { bg: 'bg-orange-100', text: 'text-orange-800', label: 'Pendiente' },
            pagado: { bg: 'bg-green-100', text: 'text-green-800', label: 'Pagado' },
            rechazado: { bg: 'bg-red-100', text: 'text-red-800', label: 'Rechazado' }
        };
        const paymentConfig = config[status] || config.pendiente;
        return (
            <span className={`px-3 py-1 rounded-full text-xs font-semibold ${paymentConfig.bg} ${paymentConfig.text}`}>
                {paymentConfig.label}
            </span>
        );
    };

    const getReturnStatusBadge = (status) => {
        const statusConfig = {
            pendiente: { bg: 'bg-yellow-100', text: 'text-yellow-800', label: 'Pendiente' },
            aprobada: { bg: 'bg-blue-100', text: 'text-blue-800', label: 'Aprobada' },
            recibida: { bg: 'bg-purple-100', text: 'text-purple-800', label: 'Recibida' },
            inspeccion: { bg: 'bg-indigo-100', text: 'text-indigo-800', label: 'En Inspección' },
            reembolsada: { bg: 'bg-green-100', text: 'text-green-800', label: 'Reembolsada' },
            rechazada: { bg: 'bg-red-100', text: 'text-red-800', label: 'Rechazada' },
            cancelada: { bg: 'bg-gray-100', text: 'text-gray-800', label: 'Cancelada' }
        };
        const config = statusConfig[status] || statusConfig.pendiente;
        return (
            <span className={`px-3 py-1 rounded-full text-xs font-semibold ${config.bg} ${config.text}`}>
                {config.label}
            </span>
        );
    };

    if (!isAuthenticated) {
        return null;
    }

    return (
        <Container>
            <div className='min-h-screen py-12'>
                {/* Header */}
                <div className='mb-8'>
                    <h1 className='text-4xl font-bold text-secondary mb-2 flex items-center gap-3'>
                        <span className='material-symbols-outlined' style={{fontSize: '40px'}}>account_circle</span>
                        Mi Cuenta
                    </h1>
                    <p className='text-gray-600'>
                        Bienvenido, {user?.name}
                    </p>
                </div>

                <div className='grid grid-cols-1 lg:grid-cols-4 gap-8'>
                    {/* Sidebar */}
                    <div className='lg:col-span-1'>
                        <div className='bg-white rounded-lg shadow-lg p-6'>
                            <div className='text-center mb-6'>
                                <div className='w-20 h-20 bg-primary rounded-full mx-auto mb-4 flex items-center justify-center'>
                                    <span className='material-symbols-outlined text-white text-5xl'>
                                        person
                                    </span>
                                </div>
                                <h2 className='font-bold text-secondary text-lg'>{user?.name}</h2>
                                <p className='text-sm text-gray-600'>{user?.email}</p>
                            </div>

                            <nav className='space-y-2'>
                                <button
                                    onClick={() => setActiveTab('orders')}
                                    className={`w-full text-left px-4 py-3 rounded-lg transition-colors flex items-center gap-3 ${
                                        activeTab === 'orders' 
                                            ? 'bg-primary text-white font-semibold' 
                                            : 'text-gray-700 hover:bg-gray-100'
                                    }`}
                                >
                                    <span className='material-symbols-outlined'>receipt_long</span>
                                    Mis Pedidos
                                </button>
                                <button
                                    onClick={() => setActiveTab('profile')}
                                    className={`w-full text-left px-4 py-3 rounded-lg transition-colors flex items-center gap-3 ${
                                        activeTab === 'profile' 
                                            ? 'bg-primary text-white font-semibold' 
                                            : 'text-gray-700 hover:bg-gray-100'
                                    }`}
                                >
                                    <span className='material-symbols-outlined'>person</span>
                                    Mi Perfil
                                </button>
                                <button
                                    onClick={() => setActiveTab('password')}
                                    className={`w-full text-left px-4 py-3 rounded-lg transition-colors flex items-center gap-3 ${
                                        activeTab === 'password' 
                                            ? 'bg-primary text-white font-semibold' 
                                            : 'text-gray-700 hover:bg-gray-100'
                                    }`}
                                >
                                    <span className='material-symbols-outlined'>lock</span>
                                    Cambiar Contraseña
                                </button>
                                <button
                                    onClick={() => setActiveTab('returns')}
                                    className={`w-full text-left px-4 py-3 rounded-lg transition-colors flex items-center gap-3 ${
                                        activeTab === 'returns' 
                                            ? 'bg-primary text-white font-semibold' 
                                            : 'text-gray-700 hover:bg-gray-100'
                                    }`}
                                >
                                    <span className='material-symbols-outlined'>package_2</span>
                                    Devoluciones
                                </button>
                            </nav>

                            <div className='mt-6 pt-6 border-t border-gray-200'>
                                <Link
                                    to='/favoritos'
                                    className='w-full text-left px-4 py-3 rounded-lg transition-colors flex items-center gap-3 text-gray-700 hover:bg-gray-100'
                                >
                                    <span className='material-symbols-outlined'>favorite</span>
                                    Mis Favoritos
                                </Link>
                            </div>
                        </div>
                    </div>

                    {/* Contenido principal */}
                    <div className='lg:col-span-3'>
                        {/* Tab: Mis Pedidos */}
                        {activeTab === 'orders' && (
                            <div className='bg-white rounded-lg shadow-lg p-6'>
                                <h2 className='text-2xl font-bold text-secondary mb-6 flex items-center gap-2'>
                                    <span className='material-symbols-outlined'>receipt_long</span>
                                    Mis Pedidos
                                </h2>

                                {loading ? (
                                    <div className='text-center py-12'>
                                        <span className='material-symbols-outlined animate-spin text-primary text-6xl'>
                                            progress_activity
                                        </span>
                                        <p className='text-gray-600 mt-4'>Cargando pedidos...</p>
                                    </div>
                                ) : orders.length === 0 ? (
                                    <div className='text-center py-12'>
                                        <span className='material-symbols-outlined text-gray-300 text-8xl'>
                                            receipt_long
                                        </span>
                                        <h3 className='text-2xl font-bold text-secondary mt-6 mb-4'>
                                            No tienes pedidos aún
                                        </h3>
                                        <p className='text-gray-600 mb-8'>
                                            Empieza a comprar y verás tus pedidos aquí
                                        </p>
                                        <Link
                                            to='/shop'
                                            className='inline-block bg-primary hover:bg-yellow-600 text-white font-bold py-3 px-8 rounded-lg transition-colors'
                                        >
                                            Ir a la Tienda
                                        </Link>
                                    </div>
                                ) : (
                                    <div className='space-y-4'>
                                        {orders.map((order) => (
                                            <div key={order._id} className='border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow'>
                                                <div className='flex justify-between items-start mb-4'>
                                                    <div>
                                                        <h3 className='font-bold text-secondary text-lg mb-1'>
                                                            {order.orderNumber}
                                                        </h3>
                                                        <p className='text-sm text-gray-600'>
                                                            {new Date(order.createdAt).toLocaleDateString('es-ES', {
                                                                year: 'numeric',
                                                                month: 'long',
                                                                day: 'numeric'
                                                            })}
                                                        </p>
                                                    </div>
                                                    <div className='text-right'>
                                                        <p className='font-bold text-primary text-2xl mb-2'>
                                                            {order.totalPrice.toFixed(2)}€
                                                        </p>
                                                        <div className='flex gap-2 justify-end'>
                                                            {getStatusBadge(order.orderStatus)}
                                                            {getPaymentBadge(order.paymentStatus)}
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className='grid grid-cols-1 md:grid-cols-2 gap-4 mb-4'>
                                                    <div>
                                                        <p className='text-sm text-gray-600 mb-2'>
                                                            <span className='font-semibold'>Productos:</span> {order.items.length}
                                                        </p>
                                                        <p className='text-sm text-gray-600 capitalize'>
                                                            <span className='font-semibold'>Pago:</span> {order.paymentMethod}
                                                        </p>
                                                    </div>
                                                    <div>
                                                        <p className='text-sm text-gray-600 mb-2'>
                                                            <span className='font-semibold'>Dirección:</span><br/>
                                                            {order.shippingAddress.address}, {order.shippingAddress.city}
                                                        </p>
                                                    </div>
                                                </div>

                                                <div className='flex flex-wrap gap-3'>
                                                    <Link
                                                        to={`/pedido-confirmado/${order._id}`}
                                                        className='text-primary hover:text-yellow-600 font-semibold text-sm flex items-center gap-1'
                                                    >
                                                        <span className='material-symbols-outlined' style={{fontSize: '18px'}}>
                                                            visibility
                                                        </span>
                                                        Ver Detalle
                                                    </Link>
                                                    <button
                                                        onClick={() => handleDownloadInvoice(order._id, order.orderNumber)}
                                                        disabled={downloadingInvoice === order._id}
                                                        className='text-indigo-600 hover:text-indigo-800 font-semibold text-sm flex items-center gap-1 disabled:opacity-50'
                                                    >
                                                        <span className='material-symbols-outlined' style={{fontSize: '18px'}}>
                                                            {downloadingInvoice === order._id ? 'progress_activity' : 'description'}
                                                        </span>
                                                        {downloadingInvoice === order._id ? 'Descargando...' : 'Descargar Factura'}
                                                    </button>
                                                    {order.orderStatus === 'entregado' && (
                                                        <Link
                                                            to={`/devolucion/${order._id}`}
                                                            className='text-purple-600 hover:text-purple-800 font-semibold text-sm flex items-center gap-1'
                                                        >
                                                            <span className='material-symbols-outlined' style={{fontSize: '18px'}}>
                                                                package_2
                                                            </span>
                                                            Solicitar Devolución
                                                        </Link>
                                                    )}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        )}

                        {/* Tab: Mi Perfil */}
                        {activeTab === 'profile' && (
                            <div className='bg-white rounded-lg shadow-lg p-6'>
                                <div className='flex justify-between items-center mb-6'>
                                    <h2 className='text-2xl font-bold text-secondary flex items-center gap-2'>
                                        <span className='material-symbols-outlined'>person</span>
                                        Mi Perfil
                                    </h2>
                                    {!isEditingProfile && (
                                        <button
                                            onClick={() => setIsEditingProfile(true)}
                                            className='flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-yellow-600 transition-colors'
                                        >
                                            <span className='material-symbols-outlined' style={{fontSize: '18px'}}>edit</span>
                                            Editar
                                        </button>
                                    )}
                                </div>

                                <form onSubmit={handleSaveProfile}>
                                    <div className='space-y-6'>
                                        <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                                            <div>
                                                <label className='block text-sm font-medium text-gray-700 mb-2'>
                                                    Nombre completo *
                                                </label>
                                                {isEditingProfile ? (
                                                    <input
                                                        type='text'
                                                        name='name'
                                                        value={profileData.name}
                                                        onChange={handleProfileChange}
                                                        required
                                                        className='w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary'
                                                    />
                                                ) : (
                                                    <p className='px-4 py-3 bg-gray-50 rounded-lg text-gray-900'>
                                                        {user?.name}
                                                    </p>
                                                )}
                                            </div>
                                            <div>
                                                <label className='block text-sm font-medium text-gray-700 mb-2'>
                                                    Email *
                                                </label>
                                                {isEditingProfile ? (
                                                    <input
                                                        type='email'
                                                        name='email'
                                                        value={profileData.email}
                                                        onChange={handleProfileChange}
                                                        required
                                                        className='w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary'
                                                    />
                                                ) : (
                                                    <p className='px-4 py-3 bg-gray-50 rounded-lg text-gray-900'>
                                                        {user?.email}
                                                    </p>
                                                )}
                                            </div>
                                        </div>

                                        <div>
                                            <label className='block text-sm font-medium text-gray-700 mb-2'>
                                                Teléfono
                                            </label>
                                            {isEditingProfile ? (
                                                <input
                                                    type='tel'
                                                    name='phone'
                                                    value={profileData.phone}
                                                    onChange={handleProfileChange}
                                                    placeholder='+34 600 000 000'
                                                    className='w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary'
                                                />
                                            ) : (
                                                <p className='px-4 py-3 bg-gray-50 rounded-lg text-gray-900'>
                                                    {user?.phone || 'No especificado'}
                                                </p>
                                            )}
                                        </div>

                                        {isEditingProfile && (
                                            <div className='flex gap-4'>
                                                <button
                                                    type='submit'
                                                    disabled={savingProfile}
                                                    className='flex-1 bg-primary hover:bg-yellow-600 text-white font-bold py-3 px-6 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed'
                                                >
                                                    {savingProfile ? 'Guardando...' : 'Guardar Cambios'}
                                                </button>
                                                <button
                                                    type='button'
                                                    onClick={() => {
                                                        setIsEditingProfile(false);
                                                        setProfileData({
                                                            name: user?.name || '',
                                                            email: user?.email || '',
                                                            phone: user?.phone || ''
                                                        });
                                                    }}
                                                    className='flex-1 bg-gray-300 hover:bg-gray-400 text-gray-700 font-bold py-3 px-6 rounded-lg transition-colors'
                                                >
                                                    Cancelar
                                                </button>
                                            </div>
                                        )}

                                        {!isEditingProfile && (
                                            <div className='pt-6 border-t border-gray-200'>
                                                <h3 className='font-semibold text-gray-700 mb-4'>Estadísticas</h3>
                                                <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
                                                    <div className='p-4 bg-gray-50 rounded-lg text-center'>
                                                        <p className='text-3xl font-bold text-primary mb-1'>{orders.length}</p>
                                                        <p className='text-sm text-gray-600'>Pedidos Totales</p>
                                                    </div>
                                                    <div className='p-4 bg-gray-50 rounded-lg text-center'>
                                                        <p className='text-3xl font-bold text-green-600 mb-1'>
                                                            {orders.filter(o => o.orderStatus === 'entregado').length}
                                                        </p>
                                                        <p className='text-sm text-gray-600'>Pedidos Entregados</p>
                                                    </div>
                                                    <div className='p-4 bg-gray-50 rounded-lg text-center'>
                                                        <p className='text-3xl font-bold text-blue-600 mb-1'>
                                                            {orders.reduce((sum, order) => sum + order.totalPrice, 0).toFixed(2)}€
                                                        </p>
                                                        <p className='text-sm text-gray-600'>Total Gastado</p>
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </form>
                            </div>
                        )}

                        {/* Tab: Cambiar Contraseña */}
                        {activeTab === 'password' && (
                            <div className='bg-white rounded-lg shadow-lg p-6'>
                                <h2 className='text-2xl font-bold text-secondary mb-6 flex items-center gap-2'>
                                    <span className='material-symbols-outlined'>lock</span>
                                    Cambiar Contraseña
                                </h2>

                                <div className='p-4 bg-blue-50 border border-blue-200 rounded-lg mb-6'>
                                    <div className='flex items-start gap-3'>
                                        <span className='material-symbols-outlined text-blue-600'>
                                            info
                                        </span>
                                        <div>
                                            <p className='text-sm text-blue-900 font-semibold mb-1'>
                                                Seguridad de la contraseña
                                            </p>
                                            <p className='text-sm text-blue-800'>
                                                Tu contraseña debe tener al menos 6 caracteres y contener una combinación de letras y números para mayor seguridad.
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                <form onSubmit={handleChangePassword}>
                                    <div className='space-y-4'>
                                        <div>
                                            <label className='block text-sm font-medium text-gray-700 mb-2'>
                                                Contraseña Actual *
                                            </label>
                                            <input
                                                type='password'
                                                name='currentPassword'
                                                value={passwordData.currentPassword}
                                                onChange={handlePasswordChange}
                                                required
                                                className='w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary'
                                                placeholder='Ingresa tu contraseña actual'
                                            />
                                        </div>
                                        <div>
                                            <label className='block text-sm font-medium text-gray-700 mb-2'>
                                                Nueva Contraseña *
                                            </label>
                                            <input
                                                type='password'
                                                name='newPassword'
                                                value={passwordData.newPassword}
                                                onChange={handlePasswordChange}
                                                required
                                                minLength={6}
                                                className='w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary'
                                                placeholder='Mínimo 6 caracteres'
                                            />
                                        </div>
                                        <div>
                                            <label className='block text-sm font-medium text-gray-700 mb-2'>
                                                Confirmar Nueva Contraseña *
                                            </label>
                                            <input
                                                type='password'
                                                name='confirmPassword'
                                                value={passwordData.confirmPassword}
                                                onChange={handlePasswordChange}
                                                required
                                                className='w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary'
                                                placeholder='Repite la nueva contraseña'
                                            />
                                        </div>
                                        <button
                                            type='submit'
                                            disabled={changingPassword}
                                            className='w-full bg-primary hover:bg-yellow-600 text-white font-bold py-3 px-6 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2'
                                        >
                                            {changingPassword ? (
                                                <>
                                                    <span className='material-symbols-outlined animate-spin'>
                                                        progress_activity
                                                    </span>
                                                    Cambiando...
                                                </>
                                            ) : (
                                                <>
                                                    <span className='material-symbols-outlined'>
                                                        lock_reset
                                                    </span>
                                                    Cambiar Contraseña
                                                </>
                                            )}
                                        </button>
                                    </div>
                                </form>
                            </div>
                        )}

                        {/* Tab: Devoluciones */}
                        {activeTab === 'returns' && (
                            <div className='bg-white rounded-lg shadow-lg p-6'>
                                <h2 className='text-2xl font-bold text-secondary mb-6 flex items-center gap-2'>
                                    <span className='material-symbols-outlined'>package_2</span>
                                    Mis Devoluciones
                                </h2>

                                {returnsLoading ? (
                                    <div className='text-center py-12'>
                                        <span className='material-symbols-outlined animate-spin text-primary text-6xl'>
                                            progress_activity
                                        </span>
                                        <p className='text-gray-600 mt-4'>Cargando devoluciones...</p>
                                    </div>
                                ) : returns.length === 0 ? (
                                    <div className='text-center py-12'>
                                        <span className='material-symbols-outlined text-gray-300 text-8xl'>
                                            package_2
                                        </span>
                                        <h3 className='text-2xl font-bold text-secondary mt-6 mb-4'>
                                            No tienes devoluciones
                                        </h3>
                                        <p className='text-gray-600 mb-8'>
                                            Puedes solicitar devoluciones desde los pedidos entregados
                                        </p>
                                        <button
                                            onClick={() => setActiveTab('orders')}
                                            className='inline-block bg-primary hover:bg-yellow-600 text-white font-bold py-3 px-8 rounded-lg transition-colors'
                                        >
                                            Ver Mis Pedidos
                                        </button>
                                    </div>
                                ) : (
                                    <div className='space-y-4'>
                                        {returns.map((returnItem) => (
                                            <div key={returnItem._id} className='border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow'>
                                                <div className='flex justify-between items-start mb-4'>
                                                    <div>
                                                        <h3 className='font-bold text-secondary text-lg mb-1'>
                                                            {returnItem.returnNumber}
                                                        </h3>
                                                        <p className='text-sm text-gray-600'>
                                                            Pedido: {returnItem.order?.orderNumber}
                                                        </p>
                                                        <p className='text-sm text-gray-600'>
                                                            {new Date(returnItem.createdAt).toLocaleDateString('es-ES', {
                                                                year: 'numeric',
                                                                month: 'long',
                                                                day: 'numeric'
                                                            })}
                                                        </p>
                                                    </div>
                                                    <div className='text-right'>
                                                        <p className='font-bold text-primary text-xl mb-2'>
                                                            {returnItem.refundAmount?.toFixed(2)}€
                                                        </p>
                                                        {getReturnStatusBadge(returnItem.status)}
                                                    </div>
                                                </div>

                                                <div className='mb-4'>
                                                    <p className='text-sm text-gray-600'>
                                                        <span className='font-semibold'>Productos:</span> {returnItem.items?.length || 0}
                                                    </p>
                                                    <p className='text-sm text-gray-600 capitalize'>
                                                        <span className='font-semibold'>Motivo:</span>{' '}
                                                        {returnItem.reason === 'defectuoso' && 'Producto defectuoso'}
                                                        {returnItem.reason === 'no_funciona' && 'No funciona correctamente'}
                                                        {returnItem.reason === 'diferente_al_pedido' && 'Diferente al pedido'}
                                                        {returnItem.reason === 'danado_en_envio' && 'Dañado en envío'}
                                                        {returnItem.reason === 'no_lo_quiero' && 'No lo quiero'}
                                                        {returnItem.reason === 'otro' && 'Otro motivo'}
                                                    </p>
                                                </div>

                                                {returnItem.status === 'aprobada' && (
                                                    <div className='bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4'>
                                                        <p className='text-sm text-blue-800'>
                                                            <span className='font-semibold'>📦 Envía los productos</span><br/>
                                                            Tu devolución ha sido aprobada. Descarga la etiqueta de devolución y envía los productos.
                                                        </p>
                                                        <a
                                                            href={`${URLDevelopment}/api/returns/${returnItem._id}/label`}
                                                            target='_blank'
                                                            rel='noopener noreferrer'
                                                            className='inline-flex items-center gap-1 mt-2 text-blue-600 hover:text-blue-800 font-semibold text-sm'
                                                        >
                                                            <span className='material-symbols-outlined' style={{fontSize: '18px'}}>download</span>
                                                            Descargar Etiqueta
                                                        </a>
                                                    </div>
                                                )}

                                                {returnItem.status === 'reembolsada' && (
                                                    <div className='bg-green-50 border border-green-200 rounded-lg p-4 mb-4'>
                                                        <p className='text-sm text-green-800'>
                                                            <span className='font-semibold'>✅ Reembolso completado</span><br/>
                                                            El reembolso de {returnItem.refundAmount?.toFixed(2)}€ ha sido procesado.
                                                        </p>
                                                    </div>
                                                )}

                                                {returnItem.status === 'rechazada' && (
                                                    <div className='bg-red-50 border border-red-200 rounded-lg p-4 mb-4'>
                                                        <p className='text-sm text-red-800'>
                                                            <span className='font-semibold'>❌ Devolución rechazada</span><br/>
                                                            {returnItem.rejectReason || 'Contacta con atención al cliente para más información.'}
                                                        </p>
                                                    </div>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </Container>
    );
};

export default UserDashboard;
