import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import axios from 'axios';
import { URLDevelopment } from '../../helpers/URL';
import ProductCard from './ProductCard';

const RecommendedProducts = ({ isAuth, title = '✨ Recomendado para ti' }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isAuth) {
      fetchRecommendations();
    } else {
      // Si no está autenticado, mostrar productos destacados
      fetchFeatured();
    }
  }, [isAuth]);

  const fetchRecommendations = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const res = await axios.get(`${URLDevelopment}/api/product/recommendations`, {
        headers: { 'x-auth-token': token }
      });
      setProducts(res.data);
    } catch (error) {
      console.error('Error al obtener recomendaciones:', error);
      // Fallback a productos destacados
      fetchFeatured();
    } finally {
      setLoading(false);
    }
  };

  const fetchFeatured = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${URLDevelopment}/api/product/featured`);
      setProducts(res.data);
    } catch (error) {
      console.error('Error al obtener productos destacados:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <section className='py-16 bg-gray-50'>
        <div className='container mx-auto px-4'>
          <h2 className='text-3xl font-bold text-secondary mb-8 text-center'>{title}</h2>
          <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6'>
            {[...Array(4)].map((_, i) => (
              <div key={i} className='bg-white rounded-lg p-4 animate-pulse'>
                <div className='bg-gray-300 h-48 rounded mb-4'></div>
                <div className='bg-gray-300 h-4 rounded mb-2'></div>
                <div className='bg-gray-300 h-4 rounded w-2/3'></div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (products.length === 0) {
    return null;
  }

  return (
    <section className='py-16 bg-gray-50'>
      <div className='container mx-auto px-4'>
        <div className='flex items-center justify-between mb-8'>
          <h2 className='text-3xl font-bold text-secondary'>{title}</h2>
          {isAuth && (
            <Link
              to='/shop'
              className='text-primary hover:text-yellow-600 font-medium flex items-center gap-1'
            >
              Ver todo
              <span className='material-symbols-outlined' style={{ fontSize: '18px' }}>
                arrow_forward
              </span>
            </Link>
          )}
        </div>
        <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6'>
          {products.slice(0, 8).map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
      </div>
    </section>
  );
};

const mapStateToProps = (state) => ({
  isAuth: state.auth.isAuthenticated
});

export default connect(mapStateToProps)(RecommendedProducts);
