import React from 'react';
import Container from '../components/container/Container';
import SEO from '../components/SEO';

const PrivacyPolicy = () => {
    return (
        <>
            <SEO 
                title="Política de Privacidad" 
                description="Política de privacidad y protección de datos de Electro Martínez"
            />
            <Container className="py-8 min-h-screen">
                <div className="max-w-4xl mx-auto">
                    <h1 className="text-4xl font-bold text-gray-900 mb-6">
                        Política de Privacidad
                    </h1>
                    
                    <div className="prose prose-lg max-w-none">
                        <p className="text-gray-600 mb-6">
                            Última actualización: Enero 2026
                        </p>

                        <section className="mb-8">
                            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                                1. Información que Recopilamos
                            </h2>
                            <p className="text-gray-700 mb-4">
                                En Electro Martínez, recopilamos la siguiente información personal:
                            </p>
                            <ul className="list-disc pl-6 text-gray-700 mb-4 space-y-2">
                                <li><strong>Información de cuenta:</strong> nombre, correo electrónico, contraseña</li>
                                <li><strong>Información de envío:</strong> dirección, teléfono, datos de contacto</li>
                                <li><strong>Información de pago:</strong> datos de tarjeta de crédito (procesados de forma segura por Stripe)</li>
                                <li><strong>Historial de compras:</strong> productos adquiridos, fechas, montos</li>
                                <li><strong>Datos de navegación:</strong> dirección IP, tipo de navegador, páginas visitadas</li>
                            </ul>
                        </section>

                        <section className="mb-8">
                            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                                2. Cómo Utilizamos su Información
                            </h2>
                            <p className="text-gray-700 mb-4">
                                Utilizamos la información recopilada para:
                            </p>
                            <ul className="list-disc pl-6 text-gray-700 mb-4 space-y-2">
                                <li>Procesar y completar sus pedidos</li>
                                <li>Enviar confirmaciones de pedidos y actualizaciones de envío</li>
                                <li>Proporcionar atención al cliente</li>
                                <li>Mejorar nuestros productos y servicios</li>
                                <li>Enviar comunicaciones promocionales (con su consentimiento)</li>
                                <li>Detectar y prevenir fraudes</li>
                                <li>Cumplir con obligaciones legales</li>
                            </ul>
                        </section>

                        <section className="mb-8">
                            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                                3. Compartir Información
                            </h2>
                            <p className="text-gray-700 mb-4">
                                No vendemos ni alquilamos su información personal a terceros. Podemos compartir su 
                                información con:
                            </p>
                            <ul className="list-disc pl-6 text-gray-700 mb-4 space-y-2">
                                <li><strong>Proveedores de servicios:</strong> empresas que nos ayudan a procesar pagos y envíos</li>
                                <li><strong>Procesadores de pago:</strong> Stripe para procesar transacciones de forma segura</li>
                                <li><strong>Servicios de análisis:</strong> para entender cómo se utiliza nuestro sitio</li>
                                <li><strong>Autoridades legales:</strong> cuando sea requerido por ley</li>
                            </ul>
                        </section>

                        <section className="mb-8">
                            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                                4. Seguridad de los Datos
                            </h2>
                            <p className="text-gray-700 mb-4">
                                Implementamos medidas de seguridad técnicas y organizativas para proteger su información:
                            </p>
                            <ul className="list-disc pl-6 text-gray-700 mb-4 space-y-2">
                                <li>Cifrado SSL/TLS para todas las transmisiones de datos</li>
                                <li>Almacenamiento seguro de contraseñas mediante hashing</li>
                                <li>Cumplimiento con PCI-DSS para el manejo de datos de pago</li>
                                <li>Acceso restringido a información personal</li>
                                <li>Monitoreo regular de sistemas para detectar vulnerabilidades</li>
                            </ul>
                        </section>

                        <section className="mb-8">
                            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                                5. Cookies y Tecnologías Similares
                            </h2>
                            <p className="text-gray-700 mb-4">
                                Utilizamos cookies y tecnologías similares para mejorar su experiencia en nuestro sitio. 
                                Las cookies nos permiten:
                            </p>
                            <ul className="list-disc pl-6 text-gray-700 mb-4 space-y-2">
                                <li>Recordar sus preferencias de navegación</li>
                                <li>Mantener su sesión activa</li>
                                <li>Guardar el contenido de su carrito de compras</li>
                                <li>Analizar el tráfico del sitio web</li>
                                <li>Personalizar el contenido y los anuncios</li>
                            </ul>
                            <p className="text-gray-700 mb-4">
                                Puede configurar su navegador para rechazar cookies, pero esto puede afectar la 
                                funcionalidad del sitio.
                            </p>
                        </section>

                        <section className="mb-8">
                            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                                6. Sus Derechos
                            </h2>
                            <p className="text-gray-700 mb-4">
                                Usted tiene derecho a:
                            </p>
                            <ul className="list-disc pl-6 text-gray-700 mb-4 space-y-2">
                                <li><strong>Acceder:</strong> solicitar una copia de su información personal</li>
                                <li><strong>Rectificar:</strong> corregir información inexacta o incompleta</li>
                                <li><strong>Eliminar:</strong> solicitar la eliminación de su información personal</li>
                                <li><strong>Limitar:</strong> restringir el procesamiento de su información</li>
                                <li><strong>Portabilidad:</strong> recibir su información en un formato estructurado</li>
                                <li><strong>Oposición:</strong> oponerse al procesamiento de su información</li>
                                <li><strong>Revocar consentimiento:</strong> retirar su consentimiento en cualquier momento</li>
                            </ul>
                            <p className="text-gray-700 mb-4">
                                Para ejercer estos derechos, contáctenos en privacy@electromartinez.com
                            </p>
                        </section>

                        <section className="mb-8">
                            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                                7. Retención de Datos
                            </h2>
                            <p className="text-gray-700 mb-4">
                                Conservamos su información personal durante el tiempo necesario para cumplir con los 
                                propósitos descritos en esta política, a menos que la ley requiera o permita un período 
                                de retención más largo. Los datos de transacciones se conservan por un mínimo de 7 años 
                                por motivos fiscales y legales.
                            </p>
                        </section>

                        <section className="mb-8">
                            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                                8. Menores de Edad
                            </h2>
                            <p className="text-gray-700 mb-4">
                                Nuestro sitio web no está dirigido a menores de 18 años. No recopilamos intencionalmente 
                                información personal de menores. Si descubrimos que hemos recopilado información de un 
                                menor sin el consentimiento parental, eliminaremos esa información inmediatamente.
                            </p>
                        </section>

                        <section className="mb-8">
                            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                                9. Enlaces a Terceros
                            </h2>
                            <p className="text-gray-700 mb-4">
                                Nuestro sitio puede contener enlaces a sitios web de terceros. No somos responsables de 
                                las prácticas de privacidad de estos sitios. Le recomendamos leer las políticas de 
                                privacidad de cada sitio web que visite.
                            </p>
                        </section>

                        <section className="mb-8">
                            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                                10. Cambios en la Política
                            </h2>
                            <p className="text-gray-700 mb-4">
                                Podemos actualizar esta Política de Privacidad periódicamente. Le notificaremos cualquier 
                                cambio significativo publicando la nueva política en esta página y actualizando la fecha 
                                de "última actualización". Le recomendamos revisar esta política regularmente.
                            </p>
                        </section>

                        <section className="mb-8">
                            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                                11. Contacto
                            </h2>
                            <p className="text-gray-700 mb-4">
                                Si tiene preguntas sobre esta Política de Privacidad o sobre cómo manejamos su información, 
                                contáctenos:
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

export default PrivacyPolicy;
