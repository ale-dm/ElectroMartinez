import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { connect } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import Button from '../components/buttons/Button';
import Container from '../components/container/Container';
import FormInput from '../components/inputs/FormInput';
import { register } from '../data/reducers/auth';

const Register = ({ register, isAuth, isLoading, user }) => {
    const navigate = useNavigate();
    const [data, setData] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
    });

    const { name, email, password, confirmPassword } = data;

    const handleChange = (name) => (event) => {
        setData({ ...data, [name]: event.target.value });
    };

    const onSubmit = async (e) => {
        e.preventDefault();
        if (password !== confirmPassword) {
            toast.error('Las contraseñas no coinciden');
        } else {
            register({ name, email, password });
        }
    };

    useEffect(() => {
        if (isAuth && user) {
            const { name, role } = user;
            toast.success(`Bienvenido ${name}`);
            if (role === 0) {
                navigate('/dashboard/user');
            } else if (role === 1) {
                navigate('/dashboard/admin');
            } else {
                navigate('/');
            }
        }
    }, [isAuth, user, navigate]);

    return (
        <Container>
            <form
                className='bg-white rounded-lg overflow-hidden shadow-2xl p-8 my-16 md:w-1/2 lg:w-1/3 mx-auto flex flex-col border-t-4 border-primary'
                onSubmit={onSubmit}
            >
                <div className='text-center mb-6'>
                    <h2 className='font-bold text-3xl text-secondary'>Crear <span className='text-primary'>Cuenta</span></h2>
                    <p className='text-gray-600 text-sm mt-2'>Únete a ElectroMartinez</p>
                </div>

                <FormInput
                    title='Nombre Completo'
                    placeholder='Juan Pérez'
                    value={name}
                    handleChange={handleChange('name')}
                    type='text'
                />
                <FormInput
                    title='Correo Electrónico'
                    placeholder='correo@ejemplo.com'
                    value={email}
                    handleChange={handleChange('email')}
                    type='email'
                />
                <FormInput
                    title='Contraseña'
                    placeholder='******'
                    value={password}
                    handleChange={handleChange('password')}
                    type='password'
                />
                <FormInput
                    title='Confirmar Contraseña'
                    placeholder='******'
                    value={confirmPassword}
                    handleChange={handleChange('confirmPassword')}
                    type='password'
                />
                {isLoading && <div className='self-center mb-3 text-primary'>Cargando...</div>}
                {!isLoading && (
                    <Button
                        title='Registrarse'
                        moreStyle='bg-primary hover:bg-yellow-600 text-white w-full mb-3 py-3 font-bold transition-colors'
                        type='submit'
                    />
                )}

                <div className='flex justify-end w-full'>
                    <Button
                        isButton={false}
                        title='¿Ya tienes cuenta? Inicia sesión'
                        href='/login'
                        moreStyle='text-gray-600 hover:text-primary text-sm'
                    />
                </div>
            </form>
        </Container>
    );
};

const mapToStateProps = (state) => ({
    isAuth: state.auth.isAuthenticated,
    isLoading: state.auth.loading,
    user: state.auth.user,
});

export default connect(mapToStateProps, { register })(Register);
