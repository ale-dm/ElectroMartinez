import React from 'react';
import Container from '../components/container/Container';
import SEO from '../components/SEO';

const CookiePolicy = () => {
    return (
        <>
            <SEO 
                title="Política de Cookies" 
                description="Información sobre el uso de cookies en Electro Martínez"
            />
            <Container className="py-8 min-h-screen">
                <div className="max-w-4xl mx-auto">
                    <h1 className="text-4xl font-bold text-gray-900 mb-6">
                        Política de Cookies
                    </h1>
                    
                    <div className="prose prose-lg max-w-none">
                        <p className="text-gray-600 mb-6">
                            Última actualización: Enero 2026
                        </p>

                        <section className="mb-8">
                            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                                1. ¿Qué son las Cookies?
                            </h2>
                            <p className="text-gray-700 mb-4">
                                Las cookies son pequeños archivos de texto que se almacenan en su dispositivo (ordenador, 
                                tablet o móvil) cuando visita nuestro sitio web. Las cookies permiten que el sitio web 
                                reconozca su dispositivo y almacene cierta información sobre sus preferencias o acciones 
                                pasadas.
                            </p>
                        </section>

                        <section className="mb-8">
                            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                                2. ¿Cómo Utilizamos las Cookies?
                            </h2>
                            <p className="text-gray-700 mb-4">
                                Utilizamos cookies para mejorar su experiencia en nuestro sitio web. Las cookies nos 
                                ayudan a:
                            </p>
                            <ul className="list-disc pl-6 text-gray-700 mb-4 space-y-2">
                                <li>Mantener su sesión activa mientras navega por el sitio</li>
                                <li>Recordar sus preferencias de navegación</li>
                                <li>Mantener los productos en su carrito de compras</li>
                                <li>Recordar sus datos de inicio de sesión (si elige esta opción)</li>
                                <li>Analizar cómo usa nuestro sitio web para mejorarlo</li>
                                <li>Personalizar el contenido y los anuncios según sus intereses</li>
                            </ul>
                        </section>

                        <section className="mb-8">
                            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                                3. Tipos de Cookies que Utilizamos
                            </h2>
                            
                            <div className="mb-6">
                                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                                    3.1. Cookies Esenciales
                                </h3>
                                <p className="text-gray-700 mb-2">
                                    Estas cookies son necesarias para el funcionamiento básico del sitio web y no pueden 
                                    ser desactivadas en nuestros sistemas.
                                </p>
                                <ul className="list-disc pl-6 text-gray-700 space-y-1">
                                    <li>Cookies de sesión: mantienen su sesión activa</li>
                                    <li>Cookies de autenticación: verifican su identidad</li>
                                    <li>Cookies de seguridad: protegen contra actividades fraudulentas</li>
                                    <li>Cookies del carrito: guardan los productos en su carrito</li>
                                </ul>
                            </div>

                            <div className="mb-6">
                                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                                    3.2. Cookies de Rendimiento
                                </h3>
                                <p className="text-gray-700 mb-2">
                                    Estas cookies nos permiten contar visitas y fuentes de tráfico para poder medir y 
                                    mejorar el rendimiento de nuestro sitio.
                                </p>
                                <ul className="list-disc pl-6 text-gray-700 space-y-1">
                                    <li>Google Analytics: analiza cómo los usuarios interactúan con el sitio</li>
                                    <li>Cookies de velocidad de carga: miden el tiempo de carga de páginas</li>
                                </ul>
                            </div>

                            <div className="mb-6">
                                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                                    3.3. Cookies de Funcionalidad
                                </h3>
                                <p className="text-gray-700 mb-2">
                                    Estas cookies permiten que el sitio web recuerde las elecciones que hace y 
                                    proporcione características mejoradas y más personales.
                                </p>
                                <ul className="list-disc pl-6 text-gray-700 space-y-1">
                                    <li>Preferencias de idioma</li>
                                    <li>Preferencias de visualización (lista/cuadrícula)</li>
                                    <li>Historial de productos vistos</li>
                                    <li>Lista de favoritos</li>
                                </ul>
                            </div>

                            <div className="mb-6">
                                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                                    3.4. Cookies de Publicidad
                                </h3>
                                <p className="text-gray-700 mb-2">
                                    Estas cookies se utilizan para mostrar anuncios relevantes para usted según sus 
                                    intereses.
                                </p>
                                <ul className="list-disc pl-6 text-gray-700 space-y-1">
                                    <li>Cookies de remarketing: muestran anuncios de productos que ha visto</li>
                                    <li>Cookies de terceros: Facebook Pixel, Google Ads</li>
                                </ul>
                            </div>
                        </section>

                        <section className="mb-8">
                            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                                4. Cookies de Terceros
                            </h2>
                            <p className="text-gray-700 mb-4">
                                Algunos servicios de terceros que utilizamos pueden colocar cookies en su dispositivo:
                            </p>
                            
                            <div className="overflow-x-auto">
                                <table className="min-w-full bg-white border border-gray-300 mb-4">
                                    <thead className="bg-gray-100">
                                        <tr>
                                            <th className="px-4 py-2 border text-left font-semibold">Servicio</th>
                                            <th className="px-4 py-2 border text-left font-semibold">Propósito</th>
                                            <th className="px-4 py-2 border text-left font-semibold">Duración</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr>
                                            <td className="px-4 py-2 border">Google Analytics</td>
                                            <td className="px-4 py-2 border">Análisis de tráfico web</td>
                                            <td className="px-4 py-2 border">2 años</td>
                                        </tr>
                                        <tr>
                                            <td className="px-4 py-2 border">Stripe</td>
                                            <td className="px-4 py-2 border">Procesamiento de pagos</td>
                                            <td className="px-4 py-2 border">Sesión</td>
                                        </tr>
                                        <tr>
                                            <td className="px-4 py-2 border">Facebook Pixel</td>
                                            <td className="px-4 py-2 border">Publicidad dirigida</td>
                                            <td className="px-4 py-2 border">90 días</td>
                                        </tr>
                                        <tr>
                                            <td className="px-4 py-2 border">Google Ads</td>
                                            <td className="px-4 py-2 border">Remarketing</td>
                                            <td className="px-4 py-2 border">90 días</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </section>

                        <section className="mb-8">
                            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                                5. Duración de las Cookies
                            </h2>
                            <p className="text-gray-700 mb-4">
                                Las cookies pueden ser temporales o permanentes:
                            </p>
                            <ul className="list-disc pl-6 text-gray-700 mb-4 space-y-2">
                                <li>
                                    <strong>Cookies de sesión:</strong> Son temporales y se eliminan cuando cierra su navegador
                                </li>
                                <li>
                                    <strong>Cookies persistentes:</strong> Permanecen en su dispositivo durante un período 
                                    específico (especificado en la cookie) o hasta que las elimine manualmente
                                </li>
                            </ul>
                        </section>

                        <section className="mb-8">
                            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                                6. Cómo Controlar y Eliminar Cookies
                            </h2>
                            <p className="text-gray-700 mb-4">
                                Puede controlar y/o eliminar las cookies según sus preferencias. Puede eliminar todas 
                                las cookies que ya están en su dispositivo y configurar la mayoría de los navegadores 
                                para evitar que se coloquen.
                            </p>
                            
                            <div className="mb-6">
                                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                                    Configuración del Navegador
                                </h3>
                                <ul className="list-disc pl-6 text-gray-700 space-y-2">
                                    <li>
                                        <strong>Google Chrome:</strong> Configuración → Privacidad y seguridad → Cookies
                                    </li>
                                    <li>
                                        <strong>Firefox:</strong> Opciones → Privacidad y seguridad → Cookies y datos del sitio
                                    </li>
                                    <li>
                                        <strong>Safari:</strong> Preferencias → Privacidad → Cookies y datos de sitios web
                                    </li>
                                    <li>
                                        <strong>Edge:</strong> Configuración → Privacidad, búsqueda y servicios → Cookies
                                    </li>
                                </ul>
                            </div>

                            <div className="bg-yellow-50 border-l-4 border-yellow-500 p-4 mb-4">
                                <p className="text-yellow-800">
                                    <strong>Importante:</strong> Si bloquea o elimina las cookies, algunas partes de 
                                    nuestro sitio web pueden no funcionar correctamente. Por ejemplo, no podrá añadir 
                                    productos a su carrito o completar una compra.
                                </p>
                            </div>
                        </section>

                        <section className="mb-8">
                            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                                7. Cookies de Redes Sociales
                            </h2>
                            <p className="text-gray-700 mb-4">
                                Nuestro sitio web incluye botones de compartir en redes sociales que permiten compartir 
                                contenido directamente en plataformas como Facebook, Twitter e Instagram. Estas redes 
                                sociales pueden establecer cookies en su dispositivo cuando:
                            </p>
                            <ul className="list-disc pl-6 text-gray-700 mb-4 space-y-2">
                                <li>Ha iniciado sesión en la red social</li>
                                <li>Hace clic en un botón de compartir</li>
                                <li>Interactúa con contenido embebido de redes sociales</li>
                            </ul>
                            <p className="text-gray-700 mb-4">
                                No controlamos estas cookies. Para obtener más información, consulte las políticas de 
                                privacidad de cada red social.
                            </p>
                        </section>

                        <section className="mb-8">
                            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                                8. Cookies de Stripe
                            </h2>
                            <p className="text-gray-700 mb-4">
                                Utilizamos Stripe para procesar pagos de forma segura. Stripe puede establecer cookies 
                                necesarias para:
                            </p>
                            <ul className="list-disc pl-6 text-gray-700 mb-4 space-y-2">
                                <li>Detectar y prevenir fraudes</li>
                                <li>Procesar transacciones de forma segura</li>
                                <li>Cumplir con los estándares PCI-DSS</li>
                            </ul>
                            <p className="text-gray-700 mb-4">
                                Para más información, consulte la <a href="https://stripe.com/privacy" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-700 underline">Política de Privacidad de Stripe</a>.
                            </p>
                        </section>

                        <section className="mb-8">
                            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                                9. Actualización de Cookies
                            </h2>
                            <p className="text-gray-700 mb-4">
                                Podemos actualizar nuestra Política de Cookies periódicamente para reflejar cambios en 
                                las cookies que utilizamos o por otras razones operativas, legales o reglamentarias. 
                                Le recomendamos revisar esta política regularmente.
                            </p>
                        </section>

                        <section className="mb-8">
                            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                                10. Consentimiento
                            </h2>
                            <p className="text-gray-700 mb-4">
                                Al utilizar nuestro sitio web, usted consiente el uso de cookies según se describe en 
                                esta política. La primera vez que visite nuestro sitio, verá un banner de cookies que 
                                le permite:
                            </p>
                            <ul className="list-disc pl-6 text-gray-700 mb-4 space-y-2">
                                <li>Aceptar todas las cookies</li>
                                <li>Rechazar cookies no esenciales</li>
                                <li>Personalizar sus preferencias de cookies</li>
                            </ul>
                            <p className="text-gray-700 mb-4">
                                Puede cambiar sus preferencias en cualquier momento accediendo a la configuración de 
                                cookies en el pie de página de nuestro sitio.
                            </p>
                        </section>

                        <section className="mb-8">
                            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                                11. Más Información
                            </h2>
                            <p className="text-gray-700 mb-4">
                                Para obtener más información sobre las cookies, incluido cómo ver qué cookies se han 
                                establecido y cómo administrarlas y eliminarlas, visite:
                            </p>
                            <ul className="list-disc pl-6 text-gray-700 mb-4 space-y-2">
                                <li><a href="https://www.allaboutcookies.org" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-700 underline">www.allaboutcookies.org</a></li>
                                <li><a href="https://www.youronlinechoices.com" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-700 underline">www.youronlinechoices.com</a></li>
                            </ul>
                        </section>

                        <section className="mb-8">
                            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                                12. Contacto
                            </h2>
                            <p className="text-gray-700 mb-4">
                                Si tiene preguntas sobre nuestra Política de Cookies, contáctenos:
                            </p>
                            <ul className="list-none pl-0 text-gray-700 space-y-2">
                                <li>• Correo electrónico: privacy@electromartinez.com</li>
                                <li>• Teléfono: +123 456 7890</li>
                                <li>• Dirección: Calle Principal 123, Ciudad, País</li>
                            </ul>
                        </section>
                    </div>
                </div>
            </Container>
        </>
    );
};

export default CookiePolicy;
