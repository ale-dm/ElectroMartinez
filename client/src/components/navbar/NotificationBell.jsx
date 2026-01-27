import React, { useState, useEffect, useRef } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { URLDevelopment } from '../../helpers/URL';

const NotificationBell = ({ isAuth }) => {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    if (isAuth) {
      fetchUnreadCount();
      // Actualizar cada 30 segundos
      const interval = setInterval(fetchUnreadCount, 30000);
      return () => clearInterval(interval);
    }
  }, [isAuth]);

  useEffect(() => {
    if (isOpen && isAuth) {
      fetchNotifications();
    }
  }, [isOpen, isAuth]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const fetchUnreadCount = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get(`${URLDevelopment}/api/notification/unread-count`, {
        headers: { 'x-auth-token': token }
      });
      setUnreadCount(res.data.count);
    } catch (error) {
      console.error('Error al obtener contador de notificaciones:', error);
    }
  };

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const res = await axios.get(`${URLDevelopment}/api/notification?limit=10`, {
        headers: { 'x-auth-token': token }
      });
      setNotifications(res.data);
    } catch (error) {
      console.error('Error al obtener notificaciones:', error);
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (id) => {
    try {
      const token = localStorage.getItem('token');
      await axios.put(
        `${URLDevelopment}/api/notification/${id}/read`,
        {},
        { headers: { 'x-auth-token': token } }
      );
      
      setNotifications(prevNots => 
        prevNots.map(not => 
          not._id === id ? { ...not, isRead: true } : not
        )
      );
      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch (error) {
      console.error('Error al marcar notificación:', error);
    }
  };

  const markAllAsRead = async () => {
    try {
      const token = localStorage.getItem('token');
      await axios.put(
        `${URLDevelopment}/api/notification/read-all`,
        {},
        { headers: { 'x-auth-token': token } }
      );
      
      setNotifications(prevNots => 
        prevNots.map(not => ({ ...not, isRead: true }))
      );
      setUnreadCount(0);
    } catch (error) {
      console.error('Error al marcar todas las notificaciones:', error);
    }
  };

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'order_status':
        return 'receipt_long';
      case 'price_drop':
        return 'trending_down';
      case 'back_in_stock':
        return 'inventory';
      case 'promotion':
        return 'local_offer';
      default:
        return 'notifications';
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Ahora';
    if (diffMins < 60) return `Hace ${diffMins} min`;
    if (diffHours < 24) return `Hace ${diffHours}h`;
    if (diffDays < 7) return `Hace ${diffDays}d`;
    return date.toLocaleDateString('es-ES', { day: 'numeric', month: 'short' });
  };

  if (!isAuth) return null;

  return (
    <div className='relative' ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className='relative flex items-center gap-2 text-white hover:text-primary transition-colors px-4 py-2'
      >
        <span className='material-symbols-outlined' style={{ fontSize: '24px' }}>
          notifications
        </span>
        <span className='hidden md:inline'>Notificaciones</span>
        {unreadCount > 0 && (
          <span className='absolute -top-1 -right-1 md:top-0 md:right-0 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-bold animate-pulse'>
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className='absolute right-0 mt-2 w-80 md:w-96 bg-white rounded-lg shadow-2xl z-50 max-h-96 overflow-hidden flex flex-col'>
          {/* Header */}
          <div className='p-4 border-b flex items-center justify-between bg-secondary'>
            <h3 className='text-lg font-bold text-white'>Notificaciones</h3>
            {unreadCount > 0 && (
              <button
                onClick={markAllAsRead}
                className='text-xs text-primary hover:text-yellow-600 font-medium'
              >
                Marcar todas como leídas
              </button>
            )}
          </div>

          {/* Lista */}
          <div className='overflow-y-auto flex-1'>
            {loading ? (
              <div className='p-8 text-center'>
                <span className='material-symbols-outlined animate-spin text-primary' style={{ fontSize: '40px' }}>
                  progress_activity
                </span>
                <p className='text-gray-600 mt-2'>Cargando...</p>
              </div>
            ) : notifications.length === 0 ? (
              <div className='p-8 text-center'>
                <span className='material-symbols-outlined text-gray-400' style={{ fontSize: '60px' }}>
                  notifications_off
                </span>
                <p className='text-gray-600 mt-2'>No tienes notificaciones</p>
              </div>
            ) : (
              <div>
                {notifications.map((notification) => (
                  <div
                    key={notification._id}
                    className={`p-4 border-b hover:bg-gray-50 transition-colors ${
                      !notification.isRead ? 'bg-blue-50' : ''
                    }`}
                  >
                    <div className='flex gap-3'>
                      <div className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center ${
                        !notification.isRead ? 'bg-primary' : 'bg-gray-200'
                      }`}>
                        <span className={`material-symbols-outlined ${
                          !notification.isRead ? 'text-dark' : 'text-gray-600'
                        }`} style={{ fontSize: '20px' }}>
                          {getNotificationIcon(notification.type)}
                        </span>
                      </div>
                      
                      <div className='flex-1 min-w-0'>
                        <p className='font-bold text-secondary text-sm mb-1'>
                          {notification.title}
                        </p>
                        <p className='text-gray-600 text-sm mb-2'>
                          {notification.message}
                        </p>
                        <div className='flex items-center justify-between'>
                          <span className='text-xs text-gray-500'>
                            {formatDate(notification.createdAt)}
                          </span>
                          <div className='flex gap-2'>
                            {notification.link && (
                              <Link
                                to={notification.link}
                                onClick={() => {
                                  markAsRead(notification._id);
                                  setIsOpen(false);
                                }}
                                className='text-xs text-primary hover:text-yellow-600 font-medium'
                              >
                                Ver detalles
                              </Link>
                            )}
                            {!notification.isRead && (
                              <button
                                onClick={() => markAsRead(notification._id)}
                                className='text-xs text-gray-500 hover:text-gray-700'
                              >
                                Marcar leída
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Footer */}
          {notifications.length > 0 && (
            <div className='p-3 border-t bg-gray-50 text-center'>
              <Link
                to='/dashboard/user'
                onClick={() => setIsOpen(false)}
                className='text-sm text-primary hover:text-yellow-600 font-medium'
              >
                Ver todas las notificaciones
              </Link>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

const mapStateToProps = (state) => ({
  isAuth: state.auth.isAuthenticated
});

export default connect(mapStateToProps)(NotificationBell);
