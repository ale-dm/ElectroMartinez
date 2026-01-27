import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import axios from 'axios';
import { URLDevelopment } from '../../helpers/URL';

const ProductReviews = ({ productId }) => {
    const { isAuthenticated, user } = useSelector(state => state.auth);
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [formData, setFormData] = useState({
        rating: 5,
        title: '',
        comment: ''
    });
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        fetchReviews();
    }, [productId]);

    const fetchReviews = async () => {
        try {
            const res = await axios.get(`${URLDevelopment}/api/review/product/${productId}`);
            setReviews(res.data);
        } catch (error) {
            console.error('Error al cargar reseñas:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!isAuthenticated) {
            toast.error('Debes iniciar sesión para dejar una reseña');
            return;
        }

        if (!formData.title.trim() || !formData.comment.trim()) {
            toast.error('Por favor completa todos los campos');
            return;
        }

        setSubmitting(true);

        try {
            const config = {
                headers: {
                    'Content-Type': 'application/json',
                    'x-auth-token': localStorage.getItem('token')
                }
            };

            await axios.post(
                `${URLDevelopment}/api/review`,
                {
                    product: productId,
                    rating: formData.rating,
                    title: formData.title,
                    comment: formData.comment
                },
                config
            );

            toast.success('Reseña publicada correctamente');
            setFormData({ rating: 5, title: '', comment: '' });
            setShowForm(false);
            fetchReviews();
        } catch (error) {
            console.error('Error al crear reseña:', error);
            const errorMsg = error.response?.data?.msg || 'Error al crear reseña';
            toast.error(errorMsg);
        } finally {
            setSubmitting(false);
        }
    };

    const handleHelpful = async (reviewId) => {
        if (!isAuthenticated) {
            toast.error('Debes iniciar sesión');
            return;
        }

        try {
            const config = {
                headers: {
                    'x-auth-token': localStorage.getItem('token')
                }
            };

            await axios.put(`${URLDevelopment}/api/review/${reviewId}/helpful`, {}, config);
            fetchReviews();
            toast.success('¡Gracias por tu valoración!');
        } catch (error) {
            console.error('Error:', error);
        }
    };

    const handleDelete = async (reviewId) => {
        if (!window.confirm('¿Estás seguro de eliminar esta reseña?')) {
            return;
        }

        try {
            const config = {
                headers: {
                    'x-auth-token': localStorage.getItem('token')
                }
            };

            await axios.delete(`${URLDevelopment}/api/review/${reviewId}`, config);
            toast.success('Reseña eliminada');
            fetchReviews();
        } catch (error) {
            console.error('Error al eliminar reseña:', error);
            toast.error('Error al eliminar reseña');
        }
    };

    const renderStars = (rating, interactive = false, onChange = null) => {
        return (
            <div className='flex gap-1'>
                {[1, 2, 3, 4, 5].map((star) => (
                    <button
                        key={star}
                        type='button'
                        onClick={() => interactive && onChange && onChange(star)}
                        className={`${interactive ? 'cursor-pointer hover:scale-110' : 'cursor-default'} transition-transform`}
                        disabled={!interactive}
                    >
                        <span
                            className={`material-symbols-outlined ${
                                star <= rating ? 'text-yellow-400' : 'text-gray-300'
                            }`}
                            style={{ fontSize: interactive ? '32px' : '20px' }}
                        >
                            {star <= rating ? 'star' : 'star_outline'}
                        </span>
                    </button>
                ))}
            </div>
        );
    };

    const averageRating = reviews.length > 0
        ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
        : 0;

    const userHasReview = reviews.some(review => review.user?._id === user?._id);

    return (
        <div className='bg-white rounded-lg shadow-lg p-6'>
            <h2 className='text-2xl font-bold text-secondary mb-6'>
                Opiniones de Clientes
            </h2>

            {/* Resumen de calificaciones */}
            <div className='flex flex-col md:flex-row gap-8 mb-8 pb-8 border-b border-gray-200'>
                <div className='flex flex-col items-center md:items-start'>
                    <div className='text-5xl font-bold text-primary mb-2'>
                        {averageRating}
                    </div>
                    <div className='mb-2'>
                        {renderStars(Math.round(averageRating))}
                    </div>
                    <p className='text-sm text-gray-600'>
                        {reviews.length} {reviews.length === 1 ? 'opinión' : 'opiniones'}
                    </p>
                </div>

                <div className='flex-1'>
                    {[5, 4, 3, 2, 1].map((stars) => {
                        const count = reviews.filter(r => r.rating === stars).length;
                        const percentage = reviews.length > 0 ? (count / reviews.length) * 100 : 0;
                        return (
                            <div key={stars} className='flex items-center gap-3 mb-2'>
                                <span className='text-sm text-gray-600 w-16'>{stars} estrellas</span>
                                <div className='flex-1 bg-gray-200 rounded-full h-2'>
                                    <div
                                        className='bg-primary h-2 rounded-full transition-all'
                                        style={{ width: `${percentage}%` }}
                                    />
                                </div>
                                <span className='text-sm text-gray-600 w-8'>{count}</span>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Botón para dejar reseña */}
            {isAuthenticated && !userHasReview && !showForm && (
                <button
                    onClick={() => setShowForm(true)}
                    className='mb-6 bg-primary hover:bg-yellow-600 text-white font-bold py-3 px-6 rounded-lg transition-colors flex items-center gap-2'
                >
                    <span className='material-symbols-outlined'>rate_review</span>
                    Escribir una reseña
                </button>
            )}

            {!isAuthenticated && (
                <div className='mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg'>
                    <p className='text-sm text-blue-900'>
                        <a href='/login' className='font-semibold hover:underline'>Inicia sesión</a> para dejar una reseña
                    </p>
                </div>
            )}

            {/* Formulario de reseña */}
            {showForm && (
                <form onSubmit={handleSubmit} className='mb-8 p-6 bg-gray-50 rounded-lg'>
                    <h3 className='text-xl font-bold text-secondary mb-4'>Escribe tu reseña</h3>
                    
                    <div className='mb-4'>
                        <label className='block text-sm font-medium text-gray-700 mb-2'>
                            Calificación
                        </label>
                        {renderStars(formData.rating, true, (rating) => 
                            setFormData({ ...formData, rating })
                        )}
                    </div>

                    <div className='mb-4'>
                        <label className='block text-sm font-medium text-gray-700 mb-2'>
                            Título de la reseña
                        </label>
                        <input
                            type='text'
                            value={formData.title}
                            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                            maxLength={100}
                            placeholder='Ej: Excelente producto'
                            className='w-full px-4 py-2 border border-gray-300 rounded-lg focus:border-primary focus:outline-none'
                            required
                        />
                    </div>

                    <div className='mb-4'>
                        <label className='block text-sm font-medium text-gray-700 mb-2'>
                            Tu opinión
                        </label>
                        <textarea
                            value={formData.comment}
                            onChange={(e) => setFormData({ ...formData, comment: e.target.value })}
                            maxLength={1000}
                            rows='4'
                            placeholder='Cuéntanos tu experiencia con este producto...'
                            className='w-full px-4 py-2 border border-gray-300 rounded-lg focus:border-primary focus:outline-none resize-none'
                            required
                        />
                        <p className='text-xs text-gray-500 mt-1'>
                            {formData.comment.length}/1000 caracteres
                        </p>
                    </div>

                    <div className='flex gap-3'>
                        <button
                            type='submit'
                            disabled={submitting}
                            className='bg-primary hover:bg-yellow-600 text-white font-bold py-2 px-6 rounded-lg transition-colors disabled:opacity-50'
                        >
                            {submitting ? 'Publicando...' : 'Publicar Reseña'}
                        </button>
                        <button
                            type='button'
                            onClick={() => setShowForm(false)}
                            className='bg-gray-300 hover:bg-gray-400 text-gray-700 font-bold py-2 px-6 rounded-lg transition-colors'
                        >
                            Cancelar
                        </button>
                    </div>
                </form>
            )}

            {/* Lista de reseñas */}
            {loading ? (
                <div className='text-center py-12'>
                    <span className='material-symbols-outlined animate-spin text-primary text-4xl'>
                        progress_activity
                    </span>
                </div>
            ) : reviews.length === 0 ? (
                <div className='text-center py-12'>
                    <span className='material-symbols-outlined text-gray-300 text-6xl'>
                        rate_review
                    </span>
                    <p className='text-gray-600 mt-4'>
                        Sé el primero en dejar una reseña
                    </p>
                </div>
            ) : (
                <div className='space-y-6'>
                    {reviews.map((review) => (
                        <div key={review._id} className='border-b border-gray-200 pb-6 last:border-0'>
                            <div className='flex justify-between items-start mb-3'>
                                <div>
                                    <div className='flex items-center gap-3 mb-2'>
                                        <p className='font-semibold text-secondary'>{review.user?.name || 'Usuario'}</p>
                                        {review.isVerifiedPurchase && (
                                            <span className='text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full font-semibold'>
                                                ✓ Compra verificada
                                            </span>
                                        )}
                                    </div>
                                    {renderStars(review.rating)}
                                </div>
                                <div className='text-right'>
                                    <p className='text-sm text-gray-600'>
                                        {new Date(review.createdAt).toLocaleDateString('es-ES')}
                                    </p>
                                    {user?._id === review.user?._id && (
                                        <button
                                            onClick={() => handleDelete(review._id)}
                                            className='text-red-600 hover:text-red-800 text-sm mt-1'
                                        >
                                            Eliminar
                                        </button>
                                    )}
                                </div>
                            </div>

                            <h4 className='font-semibold text-secondary mb-2'>{review.title}</h4>
                            <p className='text-gray-700 mb-3'>{review.comment}</p>

                            <button
                                onClick={() => handleHelpful(review._id)}
                                className='text-sm text-gray-600 hover:text-primary flex items-center gap-1'
                            >
                                <span className='material-symbols-outlined' style={{fontSize: '18px'}}>
                                    thumb_up
                                </span>
                                Útil ({review.helpful})
                            </button>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default ProductReviews;
