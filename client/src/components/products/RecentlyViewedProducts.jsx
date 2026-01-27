import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import axios from 'axios';
import { URLDevelopment } from '../../helpers/URL';
import ProductCard from './ProductCard';

const RecentlyViewedProducts = ({ isAuth }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isAuth) {
      fetchRecentlyViewed();
    } else {
      setLoading(false);
    }
  }, [isAuth]);

  const fetchRecentlyViewed = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const res = await axios.get(`${URLDevelopment}/api/product/recently-viewed?limit=8`, {
        headers: { 'x-auth-token': token }
      });
      setProducts(res.data);
    } catch (error) {
      console.error('Error al obtener productos vistos:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!isAuth || loading || products.length === 0) {
    return null;
  }

  return (
    <section className='py-16 bg-white'>
      <div className='container mx-auto px-4'>
        <div className='flex items-center justify-between mb-8'>
          <h2 className='text-3xl font-bold text-secondary'>
            <span className='material-symbols-outlined align-middle mr-2' style={{ fontSize: '32px' }}>
              history
            </span>
            Vistos recientemente
          </h2>
        </div>
        <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6'>
          {products.map((product) => (
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

export default connect(mapStateToProps)(RecentlyViewedProducts);
