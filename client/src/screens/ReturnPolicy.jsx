import React from 'react';
import Container from '../components/container/Container';
import SEO from '../components/SEO';

const ReturnPolicy = () => {
    return (
        <>
            <SEO 
                title="Política de Devoluciones" 
                description="Política de devoluciones y reembolsos de Electro Martínez"
            />
            <Container className="py-8 min-h-screen">
                <div className="max-w-4xl mx-auto">
                    <h1 className="text-4xl font-bold text-gray-900 mb-6">
                        Política de Devoluciones y Reembolsos
                    </h1>
                    
                    <div className="prose prose-lg max-w-none">
                        <p className="text-gray-600 mb-6">
                            Última actualización: Enero 2026
                        </p>

                        <section className="mb-8">
                            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                                1. Período de Devolución
                            </h2>
                            <p className="text-gray-700 mb-4">
                                En Electro Martínez, queremos que esté completamente satisfecho con su compra. Ofrecemos 
                                un período de devolución de <strong>30 días</strong> a partir de la fecha de recepción del producto.
                            </p>
                            <p className="text-gray-700 mb-4">
                                Para ser elegible para una devolución, su artículo debe estar sin usar y en las mismas 
                                condiciones en que lo recibió. Debe estar en el embalaje original con todas las etiquetas 
                                y accesorios incluidos.
                            </p>
                        </section>

                        <section className="mb-8">
                            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                                2. Condiciones de Devolución
                            </h2>
                            <p className="text-gray-700 mb-4">
                                Para realizar una devolución, el producto debe cumplir con las siguientes condiciones:
                            </p>
                            <ul className="list-disc pl-6 text-gray-700 mb-4 space-y-2">
                                <li>El producto debe estar sin usar, sin daños y en condiciones originales</li>
                                <li>Debe incluir el embalaje original, manuales, accesorios y cables</li>
                                <li>Se requiere el comprobante de compra original</li>
                                <li>Los sellos de garantía no deben estar rotos</li>
                                <li>No debe mostrar signos de uso, desgaste o instalación</li>
                            </ul>
                        </section>

                        <section className="mb-8">
                            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                                3. Productos No Retornables
                            </h2>
                            <p className="text-gray-700 mb-4">
                                Los siguientes productos no son elegibles para devolución:
                            </p>
                            <ul className="list-disc pl-6 text-gray-700 mb-4 space-y-2">
                                <li>Software con sellos de licencia abiertos</li>
                                <li>Productos de higiene personal (auriculares in-ear, etc.)</li>
                                <li>Productos personalizados o hechos a pedido</li>
                                <li>Productos en oferta o liquidación marcados como "venta final"</li>
                                <li>Tarjetas de regalo</li>
                            </ul>
                        </section>

                        <section className="mb-8">
                            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                                4. Proceso de Devolución
                            </h2>
                            <p className="text-gray-700 mb-4">
                                Para iniciar una devolución, siga estos pasos:
                            </p>
                            <ol className="list-decimal pl-6 text-gray-700 mb-4 space-y-3">
                                <li>
                                    <strong>Contacte con nosotros:</strong> Envíe un correo a devoluciones@electromartinez.com 
                                    o llame al +123 456 7890 con su número de pedido y motivo de devolución.
                                </li>
                                <li>
                                    <strong>Autorización:</strong> Recibirá un número de autorización de devolución (RMA) 
                                    dentro de 24-48 horas laborables.
                                </li>
                                <li>
                                    <strong>Empaque:</strong> Empaque cuidadosamente el producto en su caja original con 
                                    todos los accesorios. Incluya el comprobante de compra y el número RMA.
                                </li>
                                <li>
                                    <strong>Envío:</strong> Envíe el paquete a la dirección que le proporcionaremos. 
                                    Se recomienda usar un servicio con seguimiento.
                                </li>
                            </ol>
                        </section>

                        <section className="mb-8">
                            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                                5. Costos de Envío de Devolución
                            </h2>
                            <p className="text-gray-700 mb-4">
                                Los costos de envío para devoluciones dependen del motivo:
                            </p>
                            <ul className="list-disc pl-6 text-gray-700 mb-4 space-y-2">
                                <li>
                                    <strong>Producto defectuoso o error nuestro:</strong> Cubrimos todos los costos de envío
                                </li>
                                <li>
                                    <strong>Cambio de opinión:</strong> El cliente es responsable de los costos de envío de retorno
                                </li>
                                <li>
                                    <strong>Producto incorrecto recibido:</strong> Cubrimos todos los costos
                                </li>
                            </ul>
                        </section>

                        <section className="mb-8">
                            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                                6. Inspección y Procesamiento
                            </h2>
                            <p className="text-gray-700 mb-4">
                                Una vez que recibamos su devolución:
                            </p>
                            <ol className="list-decimal pl-6 text-gray-700 mb-4 space-y-2">
                                <li>Inspeccionaremos el producto dentro de 2-3 días laborables</li>
                                <li>Le notificaremos sobre el estado de su devolución</li>
                                <li>Si se aprueba, procesaremos su reembolso o cambio</li>
                                <li>Si se rechaza, le explicaremos el motivo y el producto será devuelto</li>
                            </ol>
                        </section>

                        <section className="mb-8">
                            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                                7. Reembolsos
                            </h2>
                            <p className="text-gray-700 mb-4">
                                Una vez aprobada su devolución, procesaremos el reembolso:
                            </p>
                            <ul className="list-disc pl-6 text-gray-700 mb-4 space-y-2">
                                <li>
                                    <strong>Método de reembolso:</strong> Se realizará al método de pago original
                                </li>
                                <li>
                                    <strong>Tiempo de procesamiento:</strong> 5-10 días laborables según su banco
                                </li>
                                <li>
                                    <strong>Monto:</strong> Se reembolsará el precio del producto. Los gastos de envío 
                                    originales no son reembolsables (excepto en caso de defecto)
                                </li>
                                <li>
                                    <strong>Notificación:</strong> Recibirá un email confirmando el reembolso
                                </li>
                            </ul>
                        </section>

                        <section className="mb-8">
                            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                                8. Cambios y Reemplazos
                            </h2>
                            <p className="text-gray-700 mb-4">
                                Si desea cambiar un producto por otro:
                            </p>
                            <ul className="list-disc pl-6 text-gray-700 mb-4 space-y-2">
                                <li>Siga el proceso de devolución indicando que desea un cambio</li>
                                <li>Una vez recibido y aprobado, enviaremos el producto de reemplazo</li>
                                <li>Si hay diferencia de precio, se procesará un cargo o reembolso adicional</li>
                                <li>Los cambios están sujetos a disponibilidad de stock</li>
                            </ul>
                        </section>

                        <section className="mb-8">
                            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                                9. Productos Defectuosos
                            </h2>
                            <p className="text-gray-700 mb-4">
                                Si recibe un producto defectuoso o dañado:
                            </p>
                            <ul className="list-disc pl-6 text-gray-700 mb-4 space-y-2">
                                <li>Contáctenos inmediatamente (dentro de 48 horas de recepción)</li>
                                <li>Proporcione fotos del daño o defecto</li>
                                <li>Le enviaremos un reemplazo gratuito o procesaremos un reembolso completo</li>
                                <li>Cubriremos todos los costos de envío</li>
                            </ul>
                        </section>

                        <section className="mb-8">
                            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                                10. Garantía del Fabricante
                            </h2>
                            <p className="text-gray-700 mb-4">
                                Después del período de devolución de 30 días, los productos están cubiertos por la 
                                garantía del fabricante. Para hacer efectiva la garantía:
                            </p>
                            <ul className="list-disc pl-6 text-gray-700 mb-4 space-y-2">
                                <li>Contacte con nuestro servicio de atención al cliente</li>
                                <li>Proporcione el comprobante de compra y descripción del problema</li>
                                <li>Le guiaremos a través del proceso de garantía</li>
                                <li>Los tiempos de reparación/reemplazo varían según el fabricante</li>
                            </ul>
                        </section>

                        <section className="mb-8">
                            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                                11. Contacto
                            </h2>
                            <p className="text-gray-700 mb-4">
                                Para cualquier consulta sobre devoluciones y reembolsos:
                            </p>
                            <ul className="list-none pl-0 text-gray-700 space-y-2">
                                <li>• Correo electrónico: devoluciones@electromartinez.com</li>
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

export default ReturnPolicy;
