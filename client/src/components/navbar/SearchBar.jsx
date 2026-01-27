import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { connect, useDispatch } from 'react-redux';
import axios from 'axios';
import { URLDevelopment } from '../../helpers/URL';
import { searchProducts } from '../../data/reducers/product';

const SearchBar = ({ searchProducts }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [recentSearches, setRecentSearches] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const searchRef = useRef(null);
  const debounceTimer = useRef(null);

  useEffect(() => {
    // Cargar búsquedas recientes del localStorage
    const recent = JSON.parse(localStorage.getItem('recentSearches') || '[]');
    setRecentSearches(recent);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    if (searchTerm.trim().length >= 2) {
      // Debounce para evitar demasiadas peticiones
      if (debounceTimer.current) {
        clearTimeout(debounceTimer.current);
      }

      debounceTimer.current = setTimeout(() => {
        fetchSuggestions(searchTerm);
      }, 300);
    } else {
      setSuggestions([]);
    }

    return () => {
      if (debounceTimer.current) {
        clearTimeout(debounceTimer.current);
      }
    };
  }, [searchTerm]);

  const fetchSuggestions = async (query) => {
    try {
      setIsLoading(true);
      const res = await axios.get(`${URLDevelopment}/api/product/search-suggestions?q=${query}`);
      setSuggestions(res.data);
      setShowSuggestions(true);
    } catch (error) {
      console.error('Error al obtener sugerencias:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const saveRecentSearch = (term) => {
    if (!term.trim()) return;
    
    let recent = JSON.parse(localStorage.getItem('recentSearches') || '[]');
    
    // Remover si ya existe
    recent = recent.filter(item => item.toLowerCase() !== term.toLowerCase());
    
    // Añadir al principio
    recent.unshift(term);
    
    // Mantener solo las últimas 5
    recent = recent.slice(0, 5);
    
    localStorage.setItem('recentSearches', JSON.stringify(recent));
    setRecentSearches(recent);
  };

  const clearRecentSearches = () => {
    localStorage.removeItem('recentSearches');
    setRecentSearches([]);
  };

  const handleSearch = (term) => {
    if (term.trim()) {
      saveRecentSearch(term);
      searchProducts(term);
      navigate('/shop');
      setSearchTerm('');
      setShowSuggestions(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    handleSearch(searchTerm);
  };

  const handleSuggestionClick = (suggestion) => {
    if (suggestion.type === 'product') {
      navigate(`/producto/${suggestion._id}`);
    } else if (suggestion.type === 'category') {
      navigate(`/categoria/${suggestion.slug}`);
    } else if (suggestion.type === 'brand') {
      navigate(`/marca/${suggestion.name}`);
    }
    setSearchTerm('');
    setShowSuggestions(false);
  };

  const highlightMatch = (text, query) => {
    if (!query) return text;
    const parts = text.split(new RegExp(`(${query})`, 'gi'));
    return parts.map((part, index) => 
      part.toLowerCase() === query.toLowerCase() 
        ? <mark key={index} className='bg-primary text-dark font-bold'>{part}</mark>
        : part
    );
  };

  return (
    <div className='relative flex-1 max-w-2xl' ref={searchRef}>
      <form onSubmit={handleSubmit}>
        <div className='relative'>
          <input
            type='text'
            placeholder='Buscar productos, marcas o categorías...'
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onFocus={() => {
              if (searchTerm.trim().length >= 2 || recentSearches.length > 0) {
                setShowSuggestions(true);
              }
            }}
            className='w-full px-4 py-2 pr-12 rounded-lg border-2 border-gray-300 focus:border-primary focus:outline-none'
          />
          <button 
            type='submit'
            className='absolute right-2 top-1/2 transform -translate-y-1/2 bg-primary hover:bg-yellow-600 text-white px-4 py-1 rounded transition-colors'
          >
            <span className='material-symbols-outlined' style={{ fontSize: '20px' }}>
              {isLoading ? 'progress_activity' : 'search'}
            </span>
          </button>
        </div>
      </form>

      {/* Dropdown de Sugerencias */}
      {showSuggestions && (
        <div className='absolute z-50 w-full mt-2 bg-white rounded-lg shadow-2xl max-h-96 overflow-y-auto'>
          {/* Búsquedas Recientes */}
          {searchTerm.trim().length === 0 && recentSearches.length > 0 && (
            <div className='p-3 border-b'>
              <div className='flex items-center justify-between mb-2'>
                <span className='text-sm font-bold text-gray-700'>Búsquedas recientes</span>
                <button
                  onClick={clearRecentSearches}
                  className='text-xs text-red-500 hover:text-red-700'
                >
                  Limpiar
                </button>
              </div>
              {recentSearches.map((recent, index) => (
                <button
                  key={index}
                  onClick={() => handleSearch(recent)}
                  className='flex items-center gap-2 w-full p-2 hover:bg-gray-100 rounded text-left'
                >
                  <span className='material-symbols-outlined text-gray-400' style={{ fontSize: '18px' }}>
                    history
                  </span>
                  <span className='text-sm text-gray-700'>{recent}</span>
                </button>
              ))}
            </div>
          )}

          {/* Sugerencias */}
          {searchTerm.trim().length >= 2 && (
            <>
              {isLoading ? (
                <div className='p-4 text-center'>
                  <span className='material-symbols-outlined animate-spin text-primary' style={{ fontSize: '30px' }}>
                    progress_activity
                  </span>
                </div>
              ) : suggestions.length === 0 ? (
                <div className='p-4 text-center text-gray-500'>
                  No se encontraron resultados
                </div>
              ) : (
                <>
                  {/* Productos */}
                  {suggestions.filter(s => s.type === 'product').length > 0 && (
                    <div className='p-3 border-b'>
                      <span className='text-xs font-bold text-gray-500 uppercase mb-2 block'>
                        Productos
                      </span>
                      {suggestions.filter(s => s.type === 'product').map((product) => (
                        <button
                          key={product._id}
                          onClick={() => handleSuggestionClick(product)}
                          className='flex items-center gap-3 w-full p-2 hover:bg-gray-100 rounded text-left'
                        >
                          {product.images && product.images[0] && (
                            <img
                              src={product.images[0].url}
                              alt={product.name}
                              className='w-10 h-10 object-cover rounded'
                            />
                          )}
                          <div className='flex-1 min-w-0'>
                            <p className='text-sm text-secondary font-medium truncate'>
                              {highlightMatch(product.name, searchTerm)}
                            </p>
                            <p className='text-xs text-gray-500'>
                              {product.price}€
                            </p>
                          </div>
                        </button>
                      ))}
                    </div>
                  )}

                  {/* Categorías */}
                  {suggestions.filter(s => s.type === 'category').length > 0 && (
                    <div className='p-3 border-b'>
                      <span className='text-xs font-bold text-gray-500 uppercase mb-2 block'>
                        Categorías
                      </span>
                      {suggestions.filter(s => s.type === 'category').map((category) => (
                        <button
                          key={category._id}
                          onClick={() => handleSuggestionClick(category)}
                          className='flex items-center gap-2 w-full p-2 hover:bg-gray-100 rounded text-left'
                        >
                          <span className='material-symbols-outlined text-primary' style={{ fontSize: '20px' }}>
                            category
                          </span>
                          <span className='text-sm text-secondary'>
                            {highlightMatch(category.name, searchTerm)}
                          </span>
                        </button>
                      ))}
                    </div>
                  )}

                  {/* Marcas */}
                  {suggestions.filter(s => s.type === 'brand').length > 0 && (
                    <div className='p-3'>
                      <span className='text-xs font-bold text-gray-500 uppercase mb-2 block'>
                        Marcas
                      </span>
                      {suggestions.filter(s => s.type === 'brand').map((brand, index) => (
                        <button
                          key={index}
                          onClick={() => handleSuggestionClick(brand)}
                          className='flex items-center gap-2 w-full p-2 hover:bg-gray-100 rounded text-left'
                        >
                          <span className='material-symbols-outlined text-primary' style={{ fontSize: '20px' }}>
                            verified
                          </span>
                          <span className='text-sm text-secondary'>
                            {highlightMatch(brand.name, searchTerm)}
                          </span>
                        </button>
                      ))}
                    </div>
                  )}
                </>
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default connect(null, { searchProducts })(SearchBar);
