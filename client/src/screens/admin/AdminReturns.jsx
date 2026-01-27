import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import axios from 'axios';
import AdminSidebar from '../../components/admin/AdminSidebar';
import Breadcrumbs from '../../components/admin/Breadcrumbs';
import { URLDevelopment } from '../../helpers/URL';

const AdminReturns = () => {
    const navigate = useNavigate();
    const { isAuthenticated, user } = useSelector(state => state.auth);
    const [returns, setReturns] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedReturn, setSelectedReturn] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [statusFilter, setStatusFilter] = useState('');
    const [updating, setUpdating] = useState(false);

    // Estados para actualizar devolución
    const [newStatus, setNewStatus] = useState('');
    const [adminNotes, setAdminNotes] = useState('');
    const [rejectReason, setRejectReason] = useState('');

    useEffect(() => {
        if (!isAuthenticated || user?.role !== 1) {
            navigate('/login');
            return;
        }
        fetchReturns();
    }, [isAuthenticated, user, navigate, statusFilter]);

    const fetchReturns = async () => {
        try {
            const config = {
                headers: {
                    'x-auth-token': localStorage.getItem('token')
                }
            };
            const url = statusFilter 
                ? `${URLDevelopment}/api/returns/admin/all?status=${statusFilter}`
                : `${URLDevelopment}/api/returns/admin/all`;
            const res = await axios.get(url, config);
            setReturns(res.data.returns || []);
        } catch (error) {
            console.error('Error al cargar devoluciones:', error);
            toast.error('Error al cargar devoluciones');
        } finally {
            setLoading(false);
        }
    };

    const handleOpenModal = (returnItem) => {
        setSelectedReturn(returnItem);
        setNewStatus(returnItem.status);
        setAdminNotes(returnItem.adminNotes || '');
        setRejectReason(returnItem.rejectReason || '');
        setShowModal(true);
    };

    const handleUpdateStatus = async () => {
        if (!selectedReturn) return;
        setUpdating(true);

        try {
            const config = {
                headers: {
                    'x-auth-token': localStorage.getItem('token'),
                    'Content-Type': 'application/json'
                }
            };

            await axios.put(
                `${URLDevelopment}/api/returns/admin/${selectedReturn._id}/status`,
                {
                    status: newStatus,
                    adminNotes,
                    rejectReason: newStatus === 'rechazada' ? rejectReason : undefined
                },
                config
            );

            toast.success('Estado actualizado correctamente');
            setShowModal(false);
            fetchReturns();
        } catch (error) {
            console.error('Error al actualizar:', error);
            toast.error('Error al actualizar el estado');
        } finally {
            setUpdating(false);
        }
    };

    const getStatusBadge = (status) => {
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

    const getReasonText = (reason) => {
        const reasons = {
            'defectuoso': 'Producto defectuoso',
            'no_funciona': 'No funciona correctamente',
            'diferente_al_pedido': 'Diferente al pedido',
            'danado_en_envio': 'Dañado en envío',
            'no_lo_quiero': 'No lo quiero',
            'otro': 'Otro motivo'
        };
        return reasons[reason] || reason;
    };

    const breadcrumbItems = [
        { label: 'Dashboard', path: '/dashboard/admin' },
        { label: 'Devoluciones', path: '/dashboard/admin/devoluciones' }
    ];

    return (
        <div className='min-h-screen bg-gray-100'>
            <div className='flex'>
                <AdminSidebar />
                    
                <div className='flex-1 p-8'>
                    <Breadcrumbs items={breadcrumbItems} />

                    <div className='bg-white rounded-lg shadow-lg p-6'>
                        <div className='flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6'>
                            <h1 className='text-2xl font-bold text-secondary flex items-center gap-2'>
                                <span className='material-symbols-outlined'>package_2</span>
                                Gestión de Devoluciones
                            </h1>

                            <select
                                value={statusFilter}
                                onChange={(e) => setStatusFilter(e.target.value)}
                                className='px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary'
                            >
                                <option value=''>Todos los estados</option>
                                <option value='pendiente'>Pendientes</option>
                                <option value='aprobada'>Aprobadas</option>
                                <option value='recibida'>Recibidas</option>
                                <option value='inspeccion'>En Inspección</option>
                                <option value='reembolsada'>Reembolsadas</option>
                                <option value='rechazada'>Rechazadas</option>
                            </select>
                        </div>

                        {loading ? (
                            <div className='text-center py-12'>
                                <span className='material-symbols-outlined animate-spin text-primary text-6xl'>
                                    progress_activity
                                </span>
                            </div>
                        ) : returns.length === 0 ? (
                            <div className='text-center py-12'>
                                <span className='material-symbols-outlined text-gray-300 text-8xl'>
                                    package_2
                                </span>
                                <h3 className='text-xl font-bold text-secondary mt-4'>
                                    No hay devoluciones
                                </h3>
                            </div>
                        ) : (
                            <div className='overflow-x-auto'>
                                <table className='min-w-full'>
                                    <thead className='bg-secondary text-white'>
                                        <tr>
                                            <th className='px-6 py-3 text-left text-sm font-medium uppercase tracking-wider'>
                                                Nº Devolución
                                            </th>
                                            <th className='px-6 py-3 text-left text-sm font-medium uppercase tracking-wider'>
                                                Cliente
                                            </th>
                                            <th className='px-6 py-3 text-left text-sm font-medium uppercase tracking-wider'>
                                                Pedido
                                            </th>
                                            <th className='px-6 py-3 text-left text-sm font-medium uppercase tracking-wider'>
                                                Motivo
                                            </th>
                                            <th className='px-6 py-3 text-left text-sm font-medium uppercase tracking-wider'>
                                                Importe
                                            </th>
                                            <th className='px-6 py-3 text-left text-sm font-medium uppercase tracking-wider'>
                                                Estado
                                            </th>
                                            <th className='px-6 py-3 text-left text-sm font-medium uppercase tracking-wider'>
                                                Fecha
                                            </th>
                                            <th className='px-6 py-3 text-left text-sm font-medium uppercase tracking-wider'>
                                                Acciones
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className='bg-white divide-y divide-gray-200'>
                                        {returns.map((item) => (
                                            <tr key={item._id} className='hover:bg-gray-50'>
                                                <td className='px-6 py-4 whitespace-nowrap text-sm font-semibold text-primary'>
                                                    {item.returnNumber}
                                                </td>
                                                <td className='px-6 py-4 whitespace-nowrap text-sm'>
                                                    <p className='font-semibold text-secondary'>{item.user?.name}</p>
                                                    <p className='text-gray-500 text-xs'>{item.user?.email}</p>
                                                </td>
                                                <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-600'>
                                                    {item.order?.orderNumber}
                                                </td>
                                                <td className='px-6 py-4 text-sm text-gray-600'>
                                                    {getReasonText(item.reason)}
                                                </td>
                                                <td className='px-6 py-4 whitespace-nowrap text-sm font-semibold text-secondary'>
                                                    {item.refundAmount?.toFixed(2)}€
                                                </td>
                                                <td className='px-6 py-4 whitespace-nowrap'>
                                                    {getStatusBadge(item.status)}
                                                </td>
                                                <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-600'>
                                                    {new Date(item.createdAt).toLocaleDateString('es-ES')}
                                                </td>
                                                <td className='px-6 py-4 whitespace-nowrap text-center'>
                                                    <button
                                                        onClick={() => handleOpenModal(item)}
                                                        className='text-primary hover:text-yellow-600 transition-colors'
                                                        title='Gestionar'
                                                    >
                                                        <span className='material-symbols-outlined'>edit</span>
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Modal de gestión */}
            {showModal && selectedReturn && (
            <div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4'>
                <div className='bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto'>
                    <div className='p-6'>
                        <div className='flex justify-between items-start mb-6'>
                            <div>
                                <h2 className='text-xl font-bold text-secondary'>
                                    Gestionar Devolución
                                </h2>
                                <p className='text-gray-600'>{selectedReturn.returnNumber}</p>
                            </div>
                            <button
                                onClick={() => setShowModal(false)}
                                className='text-gray-400 hover:text-gray-600'
                            >
                                <span className='material-symbols-outlined'>close</span>
                            </button>
                        </div>

                        {/* Info de la devolución */}
                        <div className='bg-gray-50 rounded-lg p-4 mb-6'>
                            <div className='grid grid-cols-2 gap-4 text-sm'>
                                <div>
                                    <p className='text-gray-500'>Cliente</p>
                                    <p className='font-semibold'>{selectedReturn.user?.name}</p>
                                </div>
                                <div>
                                    <p className='text-gray-500'>Pedido</p>
                                    <p className='font-semibold'>{selectedReturn.order?.orderNumber}</p>
                                </div>
                                <div>
                                    <p className='text-gray-500'>Motivo</p>
                                    <p className='font-semibold'>{getReasonText(selectedReturn.reason)}</p>
                                </div>
                                <div>
                                    <p className='text-gray-500'>Importe reembolso</p>
                                    <p className='font-semibold text-primary'>{selectedReturn.refundAmount?.toFixed(2)}€</p>
                                </div>
                            </div>
                            {selectedReturn.description && (
                                <div className='mt-4'>
                                    <p className='text-gray-500'>Descripción del cliente</p>
                                    <p className='text-sm mt-1'>{selectedReturn.description}</p>
                                </div>
                            )}
                        </div>

                        {/* Productos */}
                        <div className='mb-6'>
                            <h3 className='font-semibold text-secondary mb-2'>Productos a devolver</h3>
                            <div className='space-y-2'>
                                {selectedReturn.items?.map((item, idx) => (
                                    <div key={idx} className='flex items-center gap-3 bg-gray-50 p-2 rounded'>
                                        {item.image && (
                                            <img src={item.image} alt={item.name} className='w-10 h-10 object-cover rounded' />
                                        )}
                                        <div className='flex-1'>
                                            <p className='text-sm font-semibold'>{item.name}</p>
                                            <p className='text-xs text-gray-500'>Cantidad: {item.quantity}</p>
                                        </div>
                                        <p className='text-sm font-semibold'>{item.price?.toFixed(2)}€</p>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Formulario de actualización */}
                        <div className='space-y-4'>
                            <div>
                                <label className='block text-sm font-medium text-gray-700 mb-1'>
                                    Nuevo Estado
                                </label>
                                <select
                                    value={newStatus}
                                    onChange={(e) => setNewStatus(e.target.value)}
                                    className='w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary'
                                >
                                    <option value='pendiente'>Pendiente</option>
                                    <option value='aprobada'>Aprobada</option>
                                    <option value='recibida'>Recibida</option>
                                    <option value='inspeccion'>En Inspección</option>
                                    <option value='reembolsada'>Reembolsada</option>
                                    <option value='rechazada'>Rechazada</option>
                                </select>
                            </div>

                            {newStatus === 'rechazada' && (
                                <div>
                                    <label className='block text-sm font-medium text-gray-700 mb-1'>
                                        Motivo del rechazo *
                                    </label>
                                    <input
                                        type='text'
                                        value={rejectReason}
                                        onChange={(e) => setRejectReason(e.target.value)}
                                        placeholder='Especifica el motivo...'
                                        required
                                        className='w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary'
                                    />
                                </div>
                            )}

                            <div>
                                <label className='block text-sm font-medium text-gray-700 mb-1'>
                                    Notas internas
                                </label>
                                <textarea
                                    value={adminNotes}
                                    onChange={(e) => setAdminNotes(e.target.value)}
                                    placeholder='Notas para uso interno...'
                                    rows='3'
                                    className='w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary resize-none'
                                />
                            </div>

                            <div className='flex gap-3 pt-4'>
                                <button
                                    onClick={() => setShowModal(false)}
                                    className='flex-1 py-2 px-4 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors'
                                >
                                    Cancelar
                                </button>
                                <button
                                    onClick={handleUpdateStatus}
                                    disabled={updating || (newStatus === 'rechazada' && !rejectReason)}
                                    className='flex-1 py-2 px-4 bg-primary hover:bg-yellow-600 text-white font-semibold rounded-lg transition-colors disabled:opacity-50 flex items-center justify-center gap-2'
                                >
                                    {updating ? (
                                        <>
                                            <span className='material-symbols-outlined animate-spin'>progress_activity</span>
                                            Guardando...
                                        </>
                                    ) : (
                                        'Guardar Cambios'
                                    )}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            )}
        </div>
    );
};

export default AdminReturns;
