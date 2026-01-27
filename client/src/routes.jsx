import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import Navbar from './components/navbar/Navbar';
import Footer from './components/Footer';
import CartDrawer from './components/CartDrawer';
import AdminRoute from './components/routes/AdminRoute';
import Home from './screens/Home';
import Shop from './screens/Shop';
import ProductDetail from './screens/ProductDetail';
import CategoryPage from './screens/CategoryPage';
import BrandPage from './screens/BrandPage';
import Cart from './screens/Cart';
import Checkout from './screens/Checkout';
import OrderConfirmation from './screens/OrderConfirmation';
import Favorites from './screens/Favorites';
import Register from './screens/Register';
import Login from './screens/Login';
import UserDashboard from './screens/UserDashboard';
import AdminDashboard from './screens/admin/AdminDashboard';
import AdminSalesAnalytics from './screens/admin/AdminSalesAnalytics';
import AdminProducts from './screens/admin/AdminProducts';
import AdminProductForm from './screens/admin/AdminProductForm';
import AdminCategories from './screens/admin/AdminCategories';
import AdminBrands from './screens/admin/AdminBrands';
import AdminOrders from './screens/admin/AdminOrders';
import AdminOrderDetail from './screens/admin/AdminOrderDetail';
import AdminCoupons from './screens/admin/AdminCoupons';
import AdminReturns from './screens/admin/AdminReturns';
import RequestReturn from './screens/RequestReturn';
import TermsConditions from './screens/TermsConditions';
import PrivacyPolicy from './screens/PrivacyPolicy';
import ReturnPolicy from './screens/ReturnPolicy';
import ShippingPolicy from './screens/ShippingPolicy';
import AboutUs from './screens/AboutUs';
import Contact from './screens/Contact';
import CookiePolicy from './screens/CookiePolicy';

const AppRoutes = () => {
    return (
        <BrowserRouter>
            <div className="flex flex-col min-h-screen">
                <Navbar />
                <CartDrawer />
                <ToastContainer />
                <main className="flex-grow">
                    <Routes>
                        <Route path='/' element={<Home />} />
                        <Route path='/shop' element={<Shop />} />
                        <Route path='/producto/:id' element={<ProductDetail />} />
                        <Route path='/categoria/:slug' element={<CategoryPage />} />
                        <Route path='/marca/:brand' element={<BrandPage />} />
                        <Route path='/carrito' element={<Cart />} />
                        <Route path='/checkout' element={<Checkout />} />
                        <Route path='/pedido-confirmado' element={<OrderConfirmation />} />
                        <Route path='/pedido-confirmado/:orderId' element={<OrderConfirmation />} />
                        <Route path='/favoritos' element={<Favorites />} />
                        <Route path='/register' element={<Register />} />
                        <Route path='/login' element={<Login />} />
                        <Route path='/dashboard/user' element={<UserDashboard />} />
                        <Route path='/devolucion/:orderId' element={<RequestReturn />} />
                        
                        {/* Legal Pages */}
                        <Route path='/terminos-condiciones' element={<TermsConditions />} />
                        <Route path='/politica-privacidad' element={<PrivacyPolicy />} />
                        <Route path='/politica-devoluciones' element={<ReturnPolicy />} />
                        <Route path='/politica-envios' element={<ShippingPolicy />} />
                        <Route path='/politica-cookies' element={<CookiePolicy />} />
                        <Route path='/sobre-nosotros' element={<AboutUs />} />
                        <Route path='/contacto' element={<Contact />} />
                        
                        {/* Admin Routes */}
                        <Route 
                            path='/dashboard/admin' 
                            element={
                                <AdminRoute>
                                    <AdminDashboard />
                                </AdminRoute>
                            } 
                        />
                        <Route 
                            path='/dashboard/admin/products' 
                            element={
                                <AdminRoute>
                                    <AdminProducts />
                                </AdminRoute>
                            } 
                        />
                        <Route 
                            path='/dashboard/admin/products/new' 
                            element={
                                <AdminRoute>
                                    <AdminProductForm />
                                </AdminRoute>
                            } 
                        />
                        <Route 
                            path='/dashboard/admin/products/edit/:id' 
                            element={
                                <AdminRoute>
                                    <AdminProductForm />
                                </AdminRoute>
                            } 
                        />
                        <Route 
                            path='/dashboard/admin/categories' 
                            element={
                                <AdminRoute>
                                    <AdminCategories />
                                </AdminRoute>
                            } 
                        />
                        <Route 
                            path='/dashboard/admin/brands' 
                            element={
                                <AdminRoute>
                                    <AdminBrands />
                                </AdminRoute>
                            } 
                        />
                        <Route 
                            path='/dashboard/admin/pedidos' 
                            element={
                                <AdminRoute>
                                    <AdminOrders />
                                </AdminRoute>
                            } 
                        />
                        <Route 
                            path='/dashboard/admin/pedidos/:id' 
                            element={
                                <AdminRoute>
                                    <AdminOrderDetail />
                                </AdminRoute>
                            } 
                        />
                        <Route 
                            path='/dashboard/admin/cupones' 
                            element={
                                <AdminRoute>
                                    <AdminCoupons />
                                </AdminRoute>
                            } 
                        />
                        <Route 
                            path='/dashboard/admin/devoluciones' 
                            element={
                                <AdminRoute>
                                    <AdminReturns />
                                </AdminRoute>
                            } 
                        />
                        <Route 
                            path='/dashboard/admin/analytics' 
                            element={
                                <AdminRoute>
                                    <AdminSalesAnalytics />
                                </AdminRoute>
                            } 
                        />
                    </Routes>
                </main>
                <Footer />
            </div>
        </BrowserRouter>
    );
};

export default AppRoutes;
