import React from 'react';
import Container from '../components/container/Container';
import SEO from '../components/SEO';

const AboutUs = () => {
    return (
        <>
            <SEO 
                title="Sobre Nosotros" 
                description="Conoce la historia de Electro Martínez, tu tienda de confianza en tecnología y electrónica"
            />
            <Container className="py-8 min-h-screen">
                <div className="max-w-4xl mx-auto">
                    <h1 className="text-4xl font-bold text-gray-900 mb-6">
                        Sobre Nosotros
                    </h1>
                    
                    <div className="prose prose-lg max-w-none">
                        {/* Hero Image/Banner */}
                        <div className="bg-gradient-to-r from-secondary to-dark text-white p-8 rounded-lg mb-8">
                            <h2 className="text-3xl font-bold mb-4">
                                <span className="text-primary">ElectroMartinez</span>
                            </h2>
                            <p className="text-xl">
                                Tu tienda de confianza en tecnología y electrónica desde 2015
                            </p>
                        </div>

                        <section className="mb-8">
                            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                                Nuestra Historia
                            </h2>
                            <p className="text-gray-700 mb-4">
                                Electro Martínez nació en 2015 con una visión clara: hacer que la tecnología de última 
                                generación sea accesible para todos. Lo que comenzó como una pequeña tienda local se ha 
                                convertido en uno de los principales destinos online para productos electrónicos y 
                                tecnológicos en el país.
                            </p>
                            <p className="text-gray-700 mb-4">
                                Nuestra pasión por la tecnología y nuestro compromiso con la satisfacción del cliente nos 
                                han permitido crecer año tras año, ganando la confianza de miles de clientes que buscan 
                                productos de calidad al mejor precio.
                            </p>
                        </section>

                        <section className="mb-8">
                            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                                Nuestra Misión
                            </h2>
                            <p className="text-gray-700 mb-4">
                                Proporcionar a nuestros clientes acceso a productos electrónicos y tecnológicos de alta 
                                calidad, combinando precios competitivos con un servicio al cliente excepcional. Nos 
                                esforzamos por hacer que cada compra sea una experiencia positiva y memorable.
                            </p>
                        </section>

                        <section className="mb-8">
                            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                                Nuestra Visión
                            </h2>
                            <p className="text-gray-700 mb-4">
                                Ser la tienda online de electrónica más confiable y preferida del país, reconocida por 
                                nuestra amplia selección de productos, precios competitivos y excelente servicio al cliente.
                            </p>
                        </section>

                        <section className="mb-8">
                            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                                Nuestros Valores
                            </h2>
                            <div className="grid md:grid-cols-2 gap-6">
                                <div className="bg-yellow-50 p-6 rounded-lg border-l-4 border-primary">
                                    <h3 className="text-xl font-semibold text-secondary mb-2">
                                        Calidad
                                    </h3>
                                    <p className="text-gray-700">
                                        Trabajamos solo con marcas reconocidas y productos de la más alta calidad, 
                                        garantizando la satisfacción de nuestros clientes.
                                    </p>
                                </div>
                                
                                <div className="bg-yellow-50 p-6 rounded-lg border-l-4 border-primary">
                                    <h3 className="text-xl font-semibold text-secondary mb-2">
                                        Transparencia
                                    </h3>
                                    <p className="text-gray-700">
                                        Somos honestos en cada transacción, proporcionando información clara sobre 
                                        nuestros productos, precios y políticas.
                                    </p>
                                </div>
                                
                                <div className="bg-yellow-50 p-6 rounded-lg border-l-4 border-primary">
                                    <h3 className="text-xl font-semibold text-secondary mb-2">
                                        Innovación
                                    </h3>
                                    <p className="text-gray-700">
                                        Nos mantenemos a la vanguardia de la tecnología, ofreciendo los últimos 
                                        productos y las mejores soluciones para nuestros clientes.
                                    </p>
                                </div>
                                
                                <div className="bg-yellow-50 p-6 rounded-lg border-l-4 border-primary">
                                    <h3 className="text-xl font-semibold text-secondary mb-2">
                                        Atención al Cliente
                                    </h3>
                                    <p className="text-gray-700">
                                        Cada cliente es importante para nosotros. Nos comprometemos a proporcionar 
                                        asistencia rápida, amable y efectiva.
                                    </p>
                                </div>
                            </div>
                        </section>

                        <section className="mb-8">
                            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                                ¿Por Qué Elegirnos?
                            </h2>
                            <ul className="space-y-4">
                                <li className="flex items-start">
                                    <span className="text-primary text-2xl mr-3">✓</span>
                                    <div>
                                        <strong className="text-gray-900">Amplio Catálogo:</strong>
                                        <p className="text-gray-700">
                                            Miles de productos de las mejores marcas en electrónica, informática, 
                                            smartphones y más.
                                        </p>
                                    </div>
                                </li>
                                
                                <li className="flex items-start">
                                    <span className="text-primary text-2xl mr-3">✓</span>
                                    <div>
                                        <strong className="text-gray-900">Precios Competitivos:</strong>
                                        <p className="text-gray-700">
                                            Ofrecemos los mejores precios del mercado con ofertas y descuentos 
                                            exclusivos regularmente.
                                        </p>
                                    </div>
                                </li>
                                
                                <li className="flex items-start">
                                    <span className="text-primary text-2xl mr-3">✓</span>
                                    <div>
                                        <strong className="text-gray-900">Envío Rápido:</strong>
                                        <p className="text-gray-700">
                                            Procesamos y enviamos tu pedido en tiempo récord. Envío gratis en 
                                            compras superiores a $50.
                                        </p>
                                    </div>
                                </li>
                                
                                <li className="flex items-start">
                                    <span className="text-primary text-2xl mr-3">✓</span>
                                    <div>
                                        <strong className="text-gray-900">Garantía Oficial:</strong>
                                        <p className="text-gray-700">
                                            Todos nuestros productos incluyen garantía oficial del fabricante.
                                        </p>
                                    </div>
                                </li>
                                
                                <li className="flex items-start">
                                    <span className="text-primary text-2xl mr-3">✓</span>
                                    <div>
                                        <strong className="text-gray-900">Pago Seguro:</strong>
                                        <p className="text-gray-700">
                                            Utilizamos las plataformas de pago más seguras del mercado para proteger 
                                            tu información.
                                        </p>
                                    </div>
                                </li>
                                
                                <li className="flex items-start">
                                    <span className="text-primary text-2xl mr-3">✓</span>
                                    <div>
                                        <strong className="text-gray-900">Devolución Fácil:</strong>
                                        <p className="text-gray-700">
                                            30 días para devoluciones sin complicaciones si no estás completamente 
                                            satisfecho.
                                        </p>
                                    </div>
                                </li>
                            </ul>
                        </section>

                        <section className="mb-8">
                            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                                Nuestro Compromiso con la Sostenibilidad
                            </h2>
                            <p className="text-gray-700 mb-4">
                                En Electro Martínez, estamos comprometidos con el medio ambiente. Trabajamos 
                                constantemente para reducir nuestro impacto ambiental a través de:
                            </p>
                            <ul className="list-disc pl-6 text-gray-700 mb-4 space-y-2">
                                <li>Embalajes reciclables y biodegradables</li>
                                <li>Programas de reciclaje de productos electrónicos</li>
                                <li>Optimización de rutas de envío para reducir emisiones</li>
                                <li>Colaboración con fabricantes comprometidos con la sostenibilidad</li>
                            </ul>
                        </section>

                        <section className="mb-8">
                            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                                Marcas con las que Trabajamos
                            </h2>
                            <p className="text-gray-700 mb-4">
                                Somos distribuidores autorizados de las marcas más prestigiosas de la industria:
                            </p>
                            <div className="flex flex-wrap gap-4 mb-6">
                                <span className="px-4 py-2 bg-gray-100 rounded-lg font-semibold text-gray-700">Samsung</span>
                                <span className="px-4 py-2 bg-gray-100 rounded-lg font-semibold text-gray-700">Apple</span>
                                <span className="px-4 py-2 bg-gray-100 rounded-lg font-semibold text-gray-700">Sony</span>
                                <span className="px-4 py-2 bg-gray-100 rounded-lg font-semibold text-gray-700">LG</span>
                                <span className="px-4 py-2 bg-gray-100 rounded-lg font-semibold text-gray-700">HP</span>
                                <span className="px-4 py-2 bg-gray-100 rounded-lg font-semibold text-gray-700">Dell</span>
                                <span className="px-4 py-2 bg-gray-100 rounded-lg font-semibold text-gray-700">Lenovo</span>
                                <span className="px-4 py-2 bg-gray-100 rounded-lg font-semibold text-gray-700">Asus</span>
                            </div>
                        </section>

                        <section className="mb-8 bg-gray-50 p-6 rounded-lg">
                            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                                Contáctanos
                            </h2>
                            <p className="text-gray-700 mb-4">
                                ¿Tienes preguntas o sugerencias? Nos encantaría escucharte.
                            </p>
                            <ul className="space-y-2 text-gray-700">
                                <li><strong>Email:</strong> info@electromartinez.com</li>
                                <li><strong>Teléfono:</strong> +123 456 7890</li>
                                <li><strong>Dirección:</strong> Calle Principal 123, Ciudad, País</li>
                                <li><strong>Horario:</strong> Lunes a Viernes, 9:00 - 18:00</li>
                            </ul>
                        </section>

                        <div className="bg-secondary text-white p-8 rounded-lg text-center">
                            <h3 className="text-2xl font-bold mb-4">
                                ¡Gracias por confiar en <span className="text-primary">ElectroMartinez</span>!
                            </h3>
                            <p className="text-lg">
                                Tu satisfacción es nuestra mayor recompensa. Seguiremos trabajando cada día para 
                                ofrecerte la mejor experiencia de compra en tecnología.
                            </p>
                        </div>
                    </div>
                </div>
            </Container>
        </>
    );
};

export default AboutUs;
