import React, { useState } from 'react';
import Container from '../components/container/Container';
import SEO from '../components/SEO';
import { FaPhone, FaEnvelope, FaMapMarkerAlt, FaClock, FaWhatsapp } from 'react-icons/fa';
import { toast } from 'react-toastify';

const Contact = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        subject: '',
        message: ''
    });

    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);

        // Simulación de envío
        setTimeout(() => {
            toast.success('¡Mensaje enviado correctamente! Te responderemos pronto.');
            setFormData({
                name: '',
                email: '',
                subject: '',
                message: ''
            });
            setIsSubmitting(false);
        }, 1500);
    };

    return (
        <>
            <SEO 
                title="Contacto" 
                description="Contacta con Electro Martínez. Estamos aquí para ayudarte."
            />
            <Container className="py-8 min-h-screen">
                <div className="max-w-6xl mx-auto">
                    <h1 className="text-4xl font-bold text-gray-900 mb-6 text-center">
                        Contáctanos
                    </h1>
                    <p className="text-lg text-gray-600 text-center mb-12">
                        ¿Tienes alguna pregunta? Estamos aquí para ayudarte
                    </p>

                    <div className="grid lg:grid-cols-3 gap-8 mb-12">
                        {/* Contact Info Cards */}
                        <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200 hover:shadow-lg transition-shadow">
                            <div className="flex items-center justify-center w-12 h-12 bg-yellow-100 rounded-full mb-4 mx-auto">
                                <FaPhone className="text-primary text-xl" />
                            </div>
                            <h3 className="text-lg font-semibold text-gray-900 text-center mb-2">
                                Teléfono
                            </h3>
                            <p className="text-gray-600 text-center mb-2">
                                Llámanos en horario de oficina
                            </p>
                            <a 
                                href="tel:+34616180340" 
                                className="text-primary hover:text-yellow-600 font-medium block text-center"
                            >
                                616 180 340
                            </a>
                        </div>

                        <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200 hover:shadow-lg transition-shadow">
                            <div className="flex items-center justify-center w-12 h-12 bg-yellow-100 rounded-full mb-4 mx-auto">
                                <FaEnvelope className="text-primary text-xl" />
                            </div>
                            <h3 className="text-lg font-semibold text-gray-900 text-center mb-2">
                                Email
                            </h3>
                            <p className="text-gray-600 text-center mb-2">
                                Escríbenos, respondemos en 24h
                            </p>
                            <a 
                                href="mailto:info@electromartinez.com" 
                                className="text-primary hover:text-yellow-600 font-medium block text-center"
                            >
                                info@electromartinez.com
                            </a>
                        </div>

                        <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200 hover:shadow-lg transition-shadow">
                            <div className="flex items-center justify-center w-12 h-12 bg-yellow-100 rounded-full mb-4 mx-auto">
                                <FaWhatsapp className="text-primary text-xl" />
                            </div>
                            <h3 className="text-lg font-semibold text-gray-900 text-center mb-2">
                                WhatsApp
                            </h3>
                            <p className="text-gray-600 text-center mb-2">
                                Chatea con nosotros
                            </p>
                            <a 
                                href="https://wa.me/616180340" 
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-primary hover:text-yellow-600 font-medium block text-center"
                            >
                                Iniciar chat
                            </a>
                        </div>
                    </div>

                    <div className="grid lg:grid-cols-2 gap-12">
                        {/* Contact Form */}
                        <div>
                            <h2 className="text-2xl font-bold text-gray-900 mb-6">
                                Envíanos un Mensaje
                            </h2>
                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div>
                                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                                        Nombre Completo *
                                    </label>
                                    <input
                                        type="text"
                                        id="name"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleChange}
                                        required
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        placeholder="Tu nombre"
                                    />
                                </div>

                                <div>
                                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                                        Correo Electrónico *
                                    </label>
                                    <input
                                        type="email"
                                        id="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        required
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        placeholder="tu@email.com"
                                    />
                                </div>

                                <div>
                                    <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-2">
                                        Asunto *
                                    </label>
                                    <input
                                        type="text"
                                        id="subject"
                                        name="subject"
                                        value={formData.subject}
                                        onChange={handleChange}
                                        required
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        placeholder="¿En qué podemos ayudarte?"
                                    />
                                </div>

                                <div>
                                    <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                                        Mensaje *
                                    </label>
                                    <textarea
                                        id="message"
                                        name="message"
                                        value={formData.message}
                                        onChange={handleChange}
                                        required
                                        rows={6}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                                        placeholder="Escribe tu mensaje aquí..."
                                    />
                                </div>

                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="w-full bg-primary hover:bg-yellow-600 disabled:bg-gray-400 text-secondary font-semibold py-3 px-6 rounded-lg transition-colors"
                                >
                                    {isSubmitting ? 'Enviando...' : 'Enviar Mensaje'}
                                </button>
                            </form>
                        </div>

                        {/* Additional Info */}
                        <div>
                            <h2 className="text-2xl font-bold text-gray-900 mb-6">
                                Información Adicional
                            </h2>
                            
                            <div className="space-y-6">
                                <div className="bg-gray-50 p-6 rounded-lg">
                                    <div className="flex items-start">
                                        <FaMapMarkerAlt className="text-primary text-xl mr-4 mt-1" />
                                        <div>
                                            <h3 className="font-semibold text-gray-900 mb-2">Dirección</h3>
                                            <p className="text-gray-700">
                                                España
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                <div className="bg-gray-50 p-6 rounded-lg">
                                    <div className="flex items-start">
                                        <FaClock className="text-primary text-xl mr-4 mt-1" />
                                        <div>
                                            <h3 className="font-semibold text-gray-900 mb-2">Horario de Atención</h3>
                                            <p className="text-gray-700">
                                                <strong>Lunes a Viernes:</strong> 9:00 - 18:00<br />
                                                <strong>Sábados:</strong> 10:00 - 14:00<br />
                                                <strong>Domingos:</strong> Cerrado
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                <div className="bg-yellow-50 border-l-4 border-primary p-6">
                                    <h3 className="font-semibold text-secondary mb-2">
                                        Respuesta Rápida
                                    </h3>
                                    <p className="text-gray-700 text-sm">
                                        Nuestro equipo de atención al cliente responde todos los mensajes en un 
                                        plazo máximo de 24 horas laborables.
                                    </p>
                                </div>

                                <div className="bg-yellow-50 border-l-4 border-primary p-6">
                                    <h3 className="font-semibold text-secondary mb-2">
                                        Preguntas Frecuentes
                                    </h3>
                                    <p className="text-gray-700 text-sm mb-3">
                                        ¿Tienes una pregunta común? Puede que ya esté respondida en nuestras FAQ.
                                    </p>
                                    <a 
                                        href="/terminos-condiciones" 
                                        className="text-primary hover:text-yellow-600 font-medium underline"
                                    >
                                        Ver preguntas frecuentes
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Map Section (Optional) */}
                    <div className="mt-12">
                        <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
                            Encuéntranos
                        </h2>
                        <div className="bg-gray-200 rounded-lg overflow-hidden" style={{ height: '400px' }}>
                            {/* Aquí se podría integrar Google Maps o similar */}
                            <div className="flex items-center justify-center h-full text-gray-500">
                                <div className="text-center">
                                    <FaMapMarkerAlt className="text-6xl mb-4 mx-auto" />
                                    <p className="text-lg">Calle Principal 123, Ciudad, País</p>
                                    <p className="text-sm mt-2">Mapa interactivo disponible próximamente</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </Container>
        </>
    );
};

export default Contact;
