import React from 'react';
import { Link } from 'react-router-dom';
import { 
    FaFacebookF, 
    FaInstagram, 
    FaTwitter, 
    FaWhatsapp,
    FaEnvelope,
    FaPhone,
    FaMapMarkerAlt 
} from 'react-icons/fa';

const Footer = () => {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="bg-secondary text-gray-300 mt-auto">
            {/* Main Footer Content */}
            <div className="max-w-7xl mx-auto px-4 py-12">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {/* Company Info */}
                    <div>
                        <h3 className="text-primary text-lg font-bold mb-4">ElectroMartinez</h3>
                        <div className="space-y-2 text-sm mb-4">
                            <p>✓ Venta y Reparación de Electrodomésticos</p>
                            <p>✓ Instalaciones Eléctricas</p>
                            <p>✓ Iluminación LED</p>
                            <p>✓ Aire Acondicionado</p>
                        </div>
                        <div className="flex space-x-4">
                            <a 
                                href="https://facebook.com" 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="hover:text-primary transition-colors"
                                aria-label="Facebook"
                            >
                                <FaFacebookF size={20} />
                            </a>
                            <a 
                                href="https://instagram.com" 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="hover:text-primary transition-colors"
                                aria-label="Instagram"
                            >
                                <FaInstagram size={20} />
                            </a>
                            <a 
                                href="https://twitter.com" 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="hover:text-primary transition-colors"
                                aria-label="Twitter"
                            >
                                <FaTwitter size={20} />
                            </a>
                            <a 
                                href="https://wa.me/616180340" 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="hover:text-primary transition-colors"
                                aria-label="WhatsApp"
                            >
                                <FaWhatsapp size={20} />
                            </a>
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h3 className="text-primary text-lg font-bold mb-4">Enlaces Rápidos</h3>
                        <ul className="space-y-2">
                            <li>
                                <Link to="/shop" className="text-sm hover:text-primary transition-colors">
                                    Tienda
                                </Link>
                            </li>
                            <li>
                                <Link to="/sobre-nosotros" className="text-sm hover:text-primary transition-colors">
                                    Sobre Nosotros
                                </Link>
                            </li>
                            <li>
                                <Link to="/contacto" className="text-sm hover:text-primary transition-colors">
                                    Contacto
                                </Link>
                            </li>
                            <li>
                                <Link to="/favoritos" className="text-sm hover:text-primary transition-colors">
                                    Mis Favoritos
                                </Link>
                            </li>
                            <li>
                                <Link to="/dashboard/user" className="text-sm hover:text-primary transition-colors">
                                    Mi Cuenta
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Legal */}
                    <div>
                        <h3 className="text-primary text-lg font-bold mb-4">Legal</h3>
                        <ul className="space-y-2">
                            <li>
                                <Link to="/terminos-condiciones" className="text-sm hover:text-primary transition-colors">
                                    Términos y Condiciones
                                </Link>
                            </li>
                            <li>
                                <Link to="/politica-privacidad" className="text-sm hover:text-primary transition-colors">
                                    Política de Privacidad
                                </Link>
                            </li>
                            <li>
                                <Link to="/politica-devoluciones" className="text-sm hover:text-primary transition-colors">
                                    Política de Devoluciones
                                </Link>
                            </li>
                            <li>
                                <Link to="/politica-envios" className="text-sm hover:text-primary transition-colors">
                                    Política de Envíos
                                </Link>
                            </li>
                            <li>
                                <Link to="/politica-cookies" className="text-sm hover:text-primary transition-colors">
                                    Política de Cookies
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Contact Info */}
                    <div>
                        <h3 className="text-primary text-lg font-bold mb-4">Contacto</h3>
                        <ul className="space-y-3">
                            <li className="flex items-center text-sm">
                                <FaPhone className="mr-2 flex-shrink-0 text-primary" />
                                <div>
                                    <a href="tel:+34616180340" className="hover:text-primary transition-colors block font-semibold">
                                        616 180 340
                                    </a>
                                    <span className="text-xs text-gray-400">Cristian Martinez</span>
                                </div>
                            </li>
                            <li className="flex items-center text-sm">
                                <FaEnvelope className="mr-2 flex-shrink-0 text-primary" />
                                <a href="mailto:info@electromartinez.com" className="hover:text-primary transition-colors">
                                    info@electromartinez.com
                                </a>
                            </li>
                            <li className="flex items-start text-sm">
                                <FaMapMarkerAlt className="mr-2 mt-1 flex-shrink-0 text-primary" />
                                <span>España</span>
                            </li>
                        </ul>
                        
                        {/* Newsletter */}
                        <div className="mt-6">
                            <h4 className="text-primary text-sm font-semibold mb-2">Newsletter</h4>
                            <form className="flex" onSubmit={(e) => e.preventDefault()}>
                                <input 
                                    type="email" 
                                    placeholder="Tu email"
                                    className="px-3 py-2 bg-dark text-sm text-white rounded-l focus:outline-none focus:ring-2 focus:ring-primary flex-1"
                                />
                                <button 
                                    type="submit"
                                    className="px-4 py-2 bg-primary hover:bg-yellow-600 text-secondary text-sm font-medium rounded-r transition-colors"
                                >
                                    Enviar
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>

            {/* Bottom Bar */}
            <div className="border-t border-dark">
                <div className="max-w-7xl mx-auto px-4 py-6">
                    <div className="flex flex-col md:flex-row justify-between items-center text-sm">
                        <p className="mb-4 md:mb-0">
                            &copy; {currentYear} ElectroMartinez. Todos los derechos reservados.
                        </p>
                        <div className="flex space-x-4">
                            <span>Aceptamos:</span>
                            <div className="flex items-center space-x-2">
                                <span className="bg-white px-2 py-1 rounded text-xs font-bold text-secondary">VISA</span>
                                <span className="bg-white px-2 py-1 rounded text-xs font-bold text-secondary">MC</span>
                                <span className="bg-primary px-2 py-1 rounded text-xs font-bold text-secondary">AMEX</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
