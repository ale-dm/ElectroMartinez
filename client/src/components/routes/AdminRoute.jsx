import React, { useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { connect } from 'react-redux';
import { toast } from 'react-toastify';

const AdminRoute = ({ children, isAuthenticated, user, loading }) => {
    useEffect(() => {
        // Mostrar error solo cuando terminó de cargar y el usuario no es admin
        if (!loading && isAuthenticated && user && user.role !== 1) {
            toast.error('No tienes permisos de administrador');
        }
    }, [loading, isAuthenticated, user]);

    // Mostrar spinner solo si realmente está cargando
    if (loading) {
        return (
            <div className='min-h-screen flex items-center justify-center bg-background'>
                <span className='material-symbols-outlined animate-spin text-primary' style={{fontSize: '60px'}}>
                    progress_activity
                </span>
            </div>
        );
    }

    // Si no está autenticado, redirigir a login
    if (!isAuthenticated) {
        return <Navigate to='/login' />;
    }

    // Si está autenticado pero no es admin, redirigir a home
    if (user && user.role !== 1) {
        return <Navigate to='/' />;
    }

    // Si todo está bien, mostrar el contenido
    return children;
};

const mapStateToProps = (state) => ({
    isAuthenticated: state.auth.isAuthenticated,
    user: state.auth.user,
    loading: state.auth.loading
});

export default connect(mapStateToProps)(AdminRoute);
