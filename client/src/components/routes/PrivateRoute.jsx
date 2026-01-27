import React from 'react';
import { Navigate } from 'react-router-dom';
import { connect } from 'react-redux';

const PrivateRoute = ({ children, isAuthenticated, loading }) => {
    if (loading) {
        return (
            <div className='min-h-screen flex items-center justify-center bg-background'>
                <span className='material-symbols-outlined animate-spin text-primary' style={{fontSize: '60px'}}>
                    progress_activity
                </span>
            </div>
        );
    }

    return isAuthenticated ? children : <Navigate to='/login' />;
};

const mapStateToProps = (state) => ({
    isAuthenticated: state.auth.isAuthenticated,
    loading: state.auth.loading
});

export default connect(mapStateToProps)(PrivateRoute);
