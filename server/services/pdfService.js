const PDFDocument = require('pdfkit');

// Información de la empresa
const COMPANY_INFO = {
    name: 'ElectroMartínez S.L.',
    cif: 'B12345678',
    address: 'Calle Ejemplo, 123',
    city: '28001 Madrid',
    country: 'España',
    phone: '+34 900 123 456',
    email: 'info@electromartinez.com',
    web: 'www.electromartinez.com'
};

// Colores
const COLORS = {
    primary: '#1a1a2e',
    secondary: '#f5a623',
    text: '#333333',
    lightGray: '#f8f9fa',
    gray: '#6c757d'
};

/**
 * Genera una factura PDF para un pedido
 * @param {Object} order - Pedido con todos los datos
 * @returns {Promise<Buffer>} - Buffer del PDF generado
 */
const generateInvoice = (order) => {
    return new Promise((resolve, reject) => {
        try {
            const doc = new PDFDocument({ 
                size: 'A4', 
                margin: 50,
                info: {
                    Title: `Factura ${order.orderNumber}`,
                    Author: COMPANY_INFO.name,
                    Subject: `Factura del pedido ${order.orderNumber}`,
                    Creator: 'ElectroMartínez'
                }
            });
            
            const buffers = [];
            doc.on('data', buffers.push.bind(buffers));
            doc.on('end', () => {
                const pdfBuffer = Buffer.concat(buffers);
                resolve(pdfBuffer);
            });
            doc.on('error', reject);

            // === CABECERA ===
            // Logo (texto estilizado como alternativa)
            doc.fontSize(24)
               .fillColor(COLORS.primary)
               .font('Helvetica-Bold')
               .text('⚡ ElectroMartínez', 50, 50);
            
            // Datos de la empresa
            doc.fontSize(9)
               .fillColor(COLORS.gray)
               .font('Helvetica')
               .text(COMPANY_INFO.name, 50, 80)
               .text(`CIF: ${COMPANY_INFO.cif}`, 50, 92)
               .text(COMPANY_INFO.address, 50, 104)
               .text(COMPANY_INFO.city, 50, 116);

            // Número de factura y fecha (derecha)
            const invoiceNumber = `FAC-${order.orderNumber.replace('ORD-', '')}`;
            const invoiceDate = new Date(order.createdAt).toLocaleDateString('es-ES', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            });

            doc.fontSize(18)
               .fillColor(COLORS.secondary)
               .font('Helvetica-Bold')
               .text('FACTURA', 400, 50, { align: 'right' });
            
            doc.fontSize(10)
               .fillColor(COLORS.text)
               .font('Helvetica')
               .text(`Nº: ${invoiceNumber}`, 400, 75, { align: 'right' })
               .text(`Fecha: ${invoiceDate}`, 400, 90, { align: 'right' })
               .text(`Pedido: ${order.orderNumber}`, 400, 105, { align: 'right' });

            // Línea separadora
            doc.moveTo(50, 145)
               .lineTo(545, 145)
               .strokeColor(COLORS.secondary)
               .lineWidth(2)
               .stroke();

            // === DATOS DEL CLIENTE ===
            doc.fontSize(12)
               .fillColor(COLORS.primary)
               .font('Helvetica-Bold')
               .text('FACTURAR A:', 50, 165);

            const shipping = order.shippingAddress;
            doc.fontSize(10)
               .fillColor(COLORS.text)
               .font('Helvetica')
               .text(shipping.fullName, 50, 185)
               .text(shipping.address, 50, 200)
               .text(`${shipping.postalCode} ${shipping.city}`, 50, 215)
               .text(shipping.country, 50, 230)
               .text(`Tel: ${shipping.phone}`, 50, 245)
               .text(`Email: ${shipping.email}`, 50, 260);

            // Estado de pago
            const paymentStatusText = order.paymentStatus === 'pagado' ? 'PAGADO' : 
                                      order.paymentStatus === 'pendiente' ? 'PENDIENTE' : 
                                      order.paymentStatus.toUpperCase();
            const paymentStatusColor = order.paymentStatus === 'pagado' ? '#28a745' : '#dc3545';
            
            doc.fontSize(12)
               .fillColor(COLORS.primary)
               .font('Helvetica-Bold')
               .text('ESTADO:', 400, 165);
            
            doc.fontSize(14)
               .fillColor(paymentStatusColor)
               .font('Helvetica-Bold')
               .text(paymentStatusText, 400, 185);

            // Método de pago
            const paymentMethods = {
                'tarjeta': 'Tarjeta de crédito/débito',
                'paypal': 'PayPal',
                'stripe': 'Pago con tarjeta',
                'revolut_pay': 'Revolut Pay',
                'transferencia': 'Transferencia bancaria',
                'contrareembolso': 'Contrareembolso'
            };
            
            doc.fontSize(10)
               .fillColor(COLORS.text)
               .font('Helvetica')
               .text(`Método: ${paymentMethods[order.paymentMethod] || order.paymentMethod}`, 400, 210);

            // === TABLA DE PRODUCTOS ===
            const tableTop = 300;
            const tableHeaders = ['Producto', 'Cant.', 'Precio Unit.', 'Total'];
            const colWidths = [250, 50, 90, 90];
            const colX = [50, 300, 360, 455];

            // Cabecera de tabla
            doc.rect(50, tableTop, 495, 25)
               .fillColor(COLORS.primary)
               .fill();

            doc.fillColor('#ffffff')
               .fontSize(10)
               .font('Helvetica-Bold');

            tableHeaders.forEach((header, i) => {
                doc.text(header, colX[i] + 5, tableTop + 8, { 
                    width: colWidths[i] - 10,
                    align: i > 0 ? 'right' : 'left'
                });
            });

            // Filas de productos
            let yPos = tableTop + 25;
            doc.fillColor(COLORS.text).font('Helvetica');

            order.items.forEach((item, index) => {
                const rowHeight = 25;
                
                // Fondo alternado
                if (index % 2 === 0) {
                    doc.rect(50, yPos, 495, rowHeight)
                       .fillColor(COLORS.lightGray)
                       .fill();
                }

                doc.fillColor(COLORS.text).fontSize(9);

                // Nombre del producto (truncado si es muy largo)
                const productName = item.name.length > 45 ? item.name.substring(0, 42) + '...' : item.name;
                doc.text(productName, colX[0] + 5, yPos + 8, { width: colWidths[0] - 10 });
                
                // Cantidad
                doc.text(item.quantity.toString(), colX[1] + 5, yPos + 8, { 
                    width: colWidths[1] - 10, 
                    align: 'right' 
                });
                
                // Precio unitario
                doc.text(`${item.price.toFixed(2)}€`, colX[2] + 5, yPos + 8, { 
                    width: colWidths[2] - 10, 
                    align: 'right' 
                });
                
                // Total línea
                const lineTotal = item.price * item.quantity;
                doc.text(`${lineTotal.toFixed(2)}€`, colX[3] + 5, yPos + 8, { 
                    width: colWidths[3] - 10, 
                    align: 'right' 
                });

                yPos += rowHeight;
            });

            // Línea final de tabla
            doc.moveTo(50, yPos)
               .lineTo(545, yPos)
               .strokeColor(COLORS.primary)
               .lineWidth(1)
               .stroke();

            // === TOTALES ===
            yPos += 20;
            const totalsX = 360;
            const valuesX = 455;

            // Subtotal
            doc.fontSize(10).font('Helvetica');
            doc.text('Subtotal:', totalsX, yPos);
            doc.text(`${order.itemsPrice.toFixed(2)}€`, valuesX, yPos, { align: 'right', width: 90 });
            yPos += 18;

            // Descuento (si aplica)
            if (order.discountAmount > 0) {
                doc.fillColor('#28a745');
                doc.text('Descuento:', totalsX, yPos);
                doc.text(`-${order.discountAmount.toFixed(2)}€`, valuesX, yPos, { align: 'right', width: 90 });
                yPos += 18;
                doc.fillColor(COLORS.text);
                
                // Cupón usado
                if (order.coupon && order.coupon.code) {
                    doc.fontSize(8).fillColor(COLORS.gray);
                    doc.text(`Cupón: ${order.coupon.code}`, totalsX, yPos);
                    yPos += 15;
                    doc.fontSize(10).fillColor(COLORS.text);
                }
            }

            // Envío
            doc.text('Gastos de envío:', totalsX, yPos);
            const shippingText = order.shippingPrice === 0 ? 'GRATIS' : `${order.shippingPrice.toFixed(2)}€`;
            doc.text(shippingText, valuesX, yPos, { align: 'right', width: 90 });
            yPos += 18;

            // Base imponible
            const baseImponible = order.totalPrice - order.taxPrice;
            doc.text('Base imponible:', totalsX, yPos);
            doc.text(`${baseImponible.toFixed(2)}€`, valuesX, yPos, { align: 'right', width: 90 });
            yPos += 18;

            // IVA
            doc.text('IVA (21%):', totalsX, yPos);
            doc.text(`${order.taxPrice.toFixed(2)}€`, valuesX, yPos, { align: 'right', width: 90 });
            yPos += 25;

            // Total final
            doc.rect(totalsX - 10, yPos - 5, 205, 30)
               .fillColor(COLORS.secondary)
               .fill();

            doc.fillColor(COLORS.primary)
               .fontSize(14)
               .font('Helvetica-Bold')
               .text('TOTAL:', totalsX, yPos + 3)
               .text(`${order.totalPrice.toFixed(2)}€`, valuesX, yPos + 3, { align: 'right', width: 90 });

            // === PIE DE PÁGINA ===
            const footerY = 750;
            
            doc.moveTo(50, footerY)
               .lineTo(545, footerY)
               .strokeColor(COLORS.gray)
               .lineWidth(0.5)
               .stroke();

            doc.fontSize(8)
               .fillColor(COLORS.gray)
               .font('Helvetica')
               .text(
                   `${COMPANY_INFO.name} | CIF: ${COMPANY_INFO.cif} | ${COMPANY_INFO.address}, ${COMPANY_INFO.city}`,
                   50, footerY + 10,
                   { align: 'center', width: 495 }
               )
               .text(
                   `Tel: ${COMPANY_INFO.phone} | Email: ${COMPANY_INFO.email} | ${COMPANY_INFO.web}`,
                   50, footerY + 22,
                   { align: 'center', width: 495 }
               )
               .text(
                   'Gracias por su confianza',
                   50, footerY + 40,
                   { align: 'center', width: 495 }
               );

            // Finalizar documento
            doc.end();

        } catch (error) {
            reject(error);
        }
    });
};

/**
 * Genera un documento de devolución
 * @param {Object} returnRequest - Solicitud de devolución
 * @returns {Promise<Buffer>} - Buffer del PDF generado
 */
const generateReturnLabel = (returnRequest) => {
    return new Promise((resolve, reject) => {
        try {
            const doc = new PDFDocument({ 
                size: 'A4', 
                margin: 50,
                info: {
                    Title: `Devolución ${returnRequest.returnNumber}`,
                    Author: COMPANY_INFO.name
                }
            });
            
            const buffers = [];
            doc.on('data', buffers.push.bind(buffers));
            doc.on('end', () => {
                const pdfBuffer = Buffer.concat(buffers);
                resolve(pdfBuffer);
            });
            doc.on('error', reject);

            // Cabecera
            doc.fontSize(20)
               .fillColor(COLORS.primary)
               .font('Helvetica-Bold')
               .text('ETIQUETA DE DEVOLUCIÓN', { align: 'center' });

            doc.moveDown();
            doc.fontSize(14)
               .fillColor(COLORS.secondary)
               .text(`Devolución: ${returnRequest.returnNumber}`, { align: 'center' });

            doc.moveDown(2);

            // Instrucciones
            doc.fontSize(11)
               .fillColor(COLORS.text)
               .font('Helvetica')
               .text('Por favor, sigue estos pasos para completar tu devolución:', { align: 'left' });

            doc.moveDown();
            doc.list([
                'Empaqueta los productos de forma segura en su embalaje original si es posible.',
                'Incluye este documento dentro del paquete.',
                'Lleva el paquete a cualquier oficina de correos.',
                'Guarda el resguardo de envío.',
                'Te notificaremos cuando recibamos los productos.'
            ], { bulletRadius: 3, indent: 20 });

            doc.moveDown(2);

            // Dirección de devolución
            doc.rect(50, doc.y, 495, 100)
               .fillColor(COLORS.lightGray)
               .fill();

            doc.fillColor(COLORS.primary)
               .fontSize(12)
               .font('Helvetica-Bold')
               .text('ENVIAR A:', 70, doc.y - 90);

            doc.fontSize(11)
               .font('Helvetica')
               .text('ElectroMartínez - Devoluciones', 70, doc.y + 15)
               .text('Polígono Industrial Norte, Nave 23', 70, doc.y + 5)
               .text('28850 Torrejón de Ardoz, Madrid', 70, doc.y + 5)
               .text('España', 70, doc.y + 5);

            doc.moveDown(4);

            // Productos a devolver
            doc.fillColor(COLORS.primary)
               .fontSize(12)
               .font('Helvetica-Bold')
               .text('PRODUCTOS A DEVOLVER:');

            doc.moveDown();

            returnRequest.items.forEach(item => {
                doc.fontSize(10)
                   .font('Helvetica')
                   .fillColor(COLORS.text)
                   .text(`• ${item.name} (x${item.quantity})`, { indent: 20 });
            });

            doc.moveDown(2);

            // Código de barras simulado (rectángulo con número)
            const barcodeY = doc.y;
            doc.rect(150, barcodeY, 250, 60)
               .stroke();

            doc.fontSize(24)
               .fillColor(COLORS.primary)
               .font('Helvetica-Bold')
               .text(returnRequest.returnNumber, 150, barcodeY + 20, { 
                   width: 250, 
                   align: 'center' 
               });

            // Pie
            doc.fontSize(8)
               .fillColor(COLORS.gray)
               .font('Helvetica')
               .text(
                   `Fecha de solicitud: ${new Date(returnRequest.createdAt).toLocaleDateString('es-ES')} | ` +
                   `Pedido original: ${returnRequest.order?.orderNumber || 'N/A'}`,
                   50, 750,
                   { align: 'center', width: 495 }
               );

            doc.end();
        } catch (error) {
            reject(error);
        }
    });
};

module.exports = {
    generateInvoice,
    generateReturnLabel,
    COMPANY_INFO
};
