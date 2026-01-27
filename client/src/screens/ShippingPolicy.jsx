import React from 'react';
import Container from '../components/container/Container';
import SEO from '../components/SEO';

const ShippingPolicy = () => {
    return (
        <>
            <SEO 
                title="Política de Envíos" 
                description="Información sobre envíos, tiempos de entrega y costos de Electro Martínez"
            />
            <Container className="py-8 min-h-screen">
                <div className="max-w-4xl mx-auto">
                    <h1 className="text-4xl font-bold text-gray-900 mb-6">
                        Política de Envíos
                    </h1>
                    
                    <div className="prose prose-lg max-w-none">
                        <p className="text-gray-600 mb-6">
                            Última actualización: Enero 2026
                        </p>

                        <section className="mb-8">
                            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                                1. Zonas de Envío
                            </h2>
                            <p className="text-gray-700 mb-4">
                                Realizamos envíos a todo el territorio nacional. Actualmente, enviamos a:
                            </p>
                            <ul className="list-disc pl-6 text-gray-700 mb-4 space-y-2">
                                <li><strong>Zona 1:</strong> Ciudad principal y área metropolitana</li>
                                <li><strong>Zona 2:</strong> Capitales provinciales y ciudades principales</li>
                                <li><strong>Zona 3:</strong> Resto del país</li>
                            </ul>
                            <p className="text-gray-700 mb-4">
                                Para envíos internacionales, por favor contáctenos en info@electromartinez.com para 
                                consultar disponibilidad y costos.
                            </p>
                        </section>

                        <section className="mb-8">
                            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                                2. Métodos de Envío
                            </h2>
                            <p className="text-gray-700 mb-4">
                                Ofrecemos diferentes opciones de envío para adaptarnos a sus necesidades:
                            </p>
                            
                            <div className="mb-6">
                                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                                    Envío Estándar
                                </h3>
                                <ul className="list-disc pl-6 text-gray-700 space-y-2">
                                    <li><strong>Tiempo de entrega:</strong> 5-7 días laborables</li>
                                    <li><strong>Costo:</strong> $5.99 (Gratis en compras superiores a $50)</li>
                                    <li><strong>Seguimiento:</strong> Incluido</li>
                                </ul>
                            </div>

                            <div className="mb-6">
                                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                                    Envío Express
                                </h3>
                                <ul className="list-disc pl-6 text-gray-700 space-y-2">
                                    <li><strong>Tiempo de entrega:</strong> 2-3 días laborables</li>
                                    <li><strong>Costo:</strong> $12.99</li>
                                    <li><strong>Seguimiento:</strong> Incluido con actualizaciones en tiempo real</li>
                                </ul>
                            </div>

                            <div className="mb-6">
                                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                                    Envío Premium (24h)
                                </h3>
                                <ul className="list-disc pl-6 text-gray-700 space-y-2">
                                    <li><strong>Tiempo de entrega:</strong> 24 horas (solo Zona 1)</li>
                                    <li><strong>Costo:</strong> $19.99</li>
                                    <li><strong>Disponibilidad:</strong> Pedidos realizados antes de las 14:00</li>
                                    <li><strong>Seguimiento:</strong> Premium con notificaciones SMS</li>
                                </ul>
                            </div>
                        </section>

                        <section className="mb-8">
                            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                                3. Costos de Envío
                            </h2>
                            <p className="text-gray-700 mb-4">
                                Los costos de envío se calculan según:
                            </p>
                            <ul className="list-disc pl-6 text-gray-700 mb-4 space-y-2">
                                <li>Método de envío seleccionado</li>
                                <li>Peso y dimensiones del paquete</li>
                                <li>Ubicación de entrega (zona)</li>
                                <li>Valor total del pedido</li>
                            </ul>
                            <div className="bg-yellow-50 border-l-4 border-primary p-4 mb-4">
                                <p className="text-secondary font-semibold">
                                    ¡ENVÍO GRATIS en compras superiores a $50!
                                </p>
                                <p className="text-gray-700 text-sm mt-1">
                                    Aplica para envío estándar en todo el país
                                </p>
                            </div>
                        </section>

                        <section className="mb-8">
                            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                                4. Procesamiento de Pedidos
                            </h2>
                            <p className="text-gray-700 mb-4">
                                Una vez confirmado su pedido:
                            </p>
                            <ol className="list-decimal pl-6 text-gray-700 mb-4 space-y-3">
                                <li>
                                    <strong>Confirmación:</strong> Recibirá un email de confirmación con el número de pedido
                                </li>
                                <li>
                                    <strong>Procesamiento:</strong> Su pedido se procesa en 1-2 días laborables
                                </li>
                                <li>
                                    <strong>Preparación:</strong> Se empaqueta cuidadosamente con materiales de protección
                                </li>
                                <li>
                                    <strong>Envío:</strong> Recibirá un email con el número de seguimiento
                                </li>
                            </ol>
                            <p className="text-gray-700 mb-4">
                                <strong>Nota:</strong> Los pedidos realizados después de las 15:00 o en fin de semana 
                                se procesarán el siguiente día laborable.
                            </p>
                        </section>

                        <section className="mb-8">
                            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                                5. Seguimiento de Pedidos
                            </h2>
                            <p className="text-gray-700 mb-4">
                                Puede rastrear su pedido de las siguientes formas:
                            </p>
                            <ul className="list-disc pl-6 text-gray-700 mb-4 space-y-2">
                                <li>Usando el número de seguimiento enviado por email</li>
                                <li>Desde su cuenta en "Mis Pedidos"</li>
                                <li>Contactando a nuestro servicio de atención al cliente</li>
                            </ul>
                            <p className="text-gray-700 mb-4">
                                El seguimiento se actualiza cada 24 horas con la ubicación actual de su paquete.
                            </p>
                        </section>

                        <section className="mb-8">
                            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                                6. Entrega del Pedido
                            </h2>
                            <p className="text-gray-700 mb-4">
                                Al momento de la entrega:
                            </p>
                            <ul className="list-disc pl-6 text-gray-700 mb-4 space-y-2">
                                <li>Se requiere identificación válida del destinatario</li>
                                <li>El paquete debe ser inspeccionado antes de firmar la recepción</li>
                                <li>Si el paquete muestra daños externos, rechace la entrega</li>
                                <li>Si nadie está presente, se dejará un aviso de intento de entrega</li>
                                <li>El paquete se retendrá en la sucursal de transporte por 5 días</li>
                            </ul>
                        </section>

                        <section className="mb-8">
                            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                                7. Productos Voluminosos
                            </h2>
                            <p className="text-gray-700 mb-4">
                                Para productos grandes como televisores, electrodomésticos grandes, etc.:
                            </p>
                            <ul className="list-disc pl-6 text-gray-700 mb-4 space-y-2">
                                <li>Se coordinará un horario de entrega específico</li>
                                <li>Pueden aplicar costos de envío adicionales</li>
                                <li>El tiempo de entrega puede extenderse 1-2 días adicionales</li>
                                <li>Se requiere que alguien esté presente para recibir el producto</li>
                                <li>Servicio de instalación disponible (costo adicional)</li>
                            </ul>
                        </section>

                        <section className="mb-8">
                            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                                8. Retrasos en la Entrega
                            </h2>
                            <p className="text-gray-700 mb-4">
                                Aunque hacemos todo lo posible para cumplir con los tiempos estimados, los retrasos 
                                pueden ocurrir por:
                            </p>
                            <ul className="list-disc pl-6 text-gray-700 mb-4 space-y-2">
                                <li>Condiciones climáticas adversas</li>
                                <li>Eventos de fuerza mayor</li>
                                <li>Direcciones incorrectas o incompletas</li>
                                <li>Problemas con aduanas (envíos internacionales)</li>
                                <li>Alta demanda en temporada de festividades</li>
                            </ul>
                            <p className="text-gray-700 mb-4">
                                Le notificaremos inmediatamente si se presenta algún retraso y le proporcionaremos 
                                una nueva fecha estimada de entrega.
                            </p>
                        </section>

                        <section className="mb-8">
                            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                                9. Direcciones Incorrectas
                            </h2>
                            <p className="text-gray-700 mb-4">
                                Es responsabilidad del cliente proporcionar una dirección de envío correcta y completa. 
                                Si el paquete es devuelto por dirección incorrecta:
                            </p>
                            <ul className="list-disc pl-6 text-gray-700 mb-4 space-y-2">
                                <li>Se cobrará un cargo de reenvío</li>
                                <li>El tiempo de entrega se reiniciará</li>
                                <li>Deberá confirmar la dirección correcta antes del reenvío</li>
                            </ul>
                        </section>

                        <section className="mb-8">
                            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                                10. Paquetes Perdidos o Dañados
                            </h2>
                            <p className="text-gray-700 mb-4">
                                Si su paquete se pierde o llega dañado:
                            </p>
                            <ul className="list-disc pl-6 text-gray-700 mb-4 space-y-2">
                                <li>Contáctenos inmediatamente</li>
                                <li>Proporcione fotos del daño (si aplica)</li>
                                <li>Iniciaremos una investigación con la empresa de transporte</li>
                                <li>Le enviaremos un reemplazo o procesaremos un reembolso completo</li>
                            </ul>
                            <p className="text-gray-700 mb-4">
                                Todos nuestros envíos están asegurados hasta el valor total del pedido.
                            </p>
                        </section>

                        <section className="mb-8">
                            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                                11. Contacto
                            </h2>
                            <p className="text-gray-700 mb-4">
                                Para consultas sobre envíos:
                            </p>
                            <ul className="list-none pl-0 text-gray-700 space-y-2">
                                <li>• Correo electrónico: envios@electromartinez.com</li>
                                <li>• Teléfono: +123 456 7890</li>
                                <li>• Horario: Lunes a Viernes, 9:00 - 18:00</li>
                            </ul>
                        </section>
                    </div>
                </div>
            </Container>
        </>
    );
};

export default ShippingPolicy;
