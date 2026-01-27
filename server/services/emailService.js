const { Resend } = require('resend');

// Inicializar Resend con API Key
const resend = new Resend(process.env.RESEND_API_KEY);

// Plantilla de email de bienvenida
const welcomeEmail = (userName, userEmail) => ({
    from: process.env.EMAIL_FROM || 'ElectroMartinez <onboarding@resend.dev>',
    to: userEmail,
    subject: '¡Bienvenido a ElectroMartinez! 🎉',
    html: `
        <!DOCTYPE html>
        <html>
        <head>
            <style>
                body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
                .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                .header { background: linear-gradient(135deg, #FDB913 0%, #f59e0b 100%); color: #1a1a1a; padding: 30px; text-align: center; border-radius: 8px 8px 0 0; }
                .content { background: #f9fafb; padding: 30px; border-radius: 0 0 8px 8px; }
                .button { display: inline-block; background: #FDB913; color: #1a1a1a; padding: 12px 30px; text-decoration: none; border-radius: 6px; margin: 20px 0; font-weight: bold; }
                .footer { text-align: center; margin-top: 20px; color: #6b7280; font-size: 14px; }
            </style>
        </head>
        <body>
            <div class="container">
                <div class="header">
                    <h1>¡Bienvenido a ElectroMartinez!</h1>
                </div>
                <div class="content">
                    <p>Hola <strong>${userName}</strong>,</p>
                    <p>Gracias por registrarte en ElectroMartinez. Tu cuenta ha sido creada exitosamente.</p>
                    <p>Ahora puedes disfrutar de:</p>
                    <ul>
                        <li>✅ Compras rápidas y seguras</li>
                        <li>✅ Seguimiento de tus pedidos</li>
                        <li>✅ Lista de favoritos</li>
                        <li>✅ Ofertas exclusivas</li>
                    </ul>
                    <center>
                        <a href="${process.env.FRONTEND_URL || 'http://localhost:5173'}/shop" class="button">
                            Explorar Productos
                        </a>
                    </center>
                    <p>Si tienes alguna pregunta, no dudes en contactarnos.</p>
                    <p>¡Felices compras! 🛒</p>
                </div>
                <div class="footer">
                    <p>ElectroMartinez - Los mejores electrodomésticos a los mejores precios</p>
                    <p>Este email fue enviado a ${userEmail}</p>
                </div>
            </div>
        </body>
        </html>
    `
});

// Plantilla de email de confirmación de pedido
const orderConfirmationEmail = (userName, userEmail, order) => {
    const productsHtml = order.products.map(item => `
        <tr>
            <td style="padding: 10px; border-bottom: 1px solid #e5e7eb;">${item.name}</td>
            <td style="padding: 10px; border-bottom: 1px solid #e5e7eb; text-align: center;">${item.quantity}</td>
            <td style="padding: 10px; border-bottom: 1px solid #e5e7eb; text-align: right;">${item.price.toFixed(2)}€</td>
        </tr>
    `).join('');

    return {
        from: process.env.EMAIL_FROM || 'ElectroMartinez <onboarding@resend.dev>',
        to: userEmail,
        subject: `Confirmación de Pedido #${order.orderNumber} ✅`,
        html: `
            <!DOCTYPE html>
            <html>
            <head>
                <style>
                    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
                    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                    .header { background: linear-gradient(135deg, #10b981 0%, #059669 100%); color: white; padding: 30px; text-align: center; border-radius: 8px 8px 0 0; }
                    .content { background: #f9fafb; padding: 30px; }
                    .order-number { background: white; padding: 15px; border-radius: 6px; text-align: center; margin: 20px 0; border: 2px dashed #FDB913; }
                    .table { width: 100%; background: white; border-radius: 6px; margin: 20px 0; }
                    .total { background: #FDB913; color: #1a1a1a; padding: 15px; text-align: right; font-size: 18px; font-weight: bold; }
                    .button { display: inline-block; background: #FDB913; color: #1a1a1a; padding: 12px 30px; text-decoration: none; border-radius: 6px; margin: 20px 0; font-weight: bold; }
                    .footer { text-align: center; margin-top: 20px; color: #6b7280; font-size: 14px; }
                </style>
            </head>
            <body>
                <div class="container">
                    <div class="header">
                        <h1>✅ ¡Pedido Confirmado!</h1>
                    </div>
                    <div class="content">
                        <p>Hola <strong>${userName}</strong>,</p>
                        <p>Gracias por tu pedido. Hemos recibido tu solicitud y está siendo procesada.</p>
                        
                        <div class="order-number">
                            <h2 style="margin: 0; color: #FDB913;">Pedido #${order.orderNumber}</h2>
                        </div>

                        <h3>Detalles del Pedido:</h3>
                        <table class="table" cellpadding="0" cellspacing="0">
                            <thead>
                                <tr style="background: #f3f4f6;">
                                    <th style="padding: 10px; text-align: left;">Producto</th>
                                    <th style="padding: 10px; text-align: center;">Cantidad</th>
                                    <th style="padding: 10px; text-align: right;">Precio</th>
                                </tr>
                            </thead>
                            <tbody>
                                ${productsHtml}
                            </tbody>
                        </table>

                        <div class="total">
                            Total: ${order.totalPrice.toFixed(2)}€
                        </div>

                        <h3>Dirección de Envío:</h3>
                        <p style="background: white; padding: 15px; border-radius: 6px;">
                            ${order.shippingAddress.fullName}<br>
                            ${order.shippingAddress.address}<br>
                            ${order.shippingAddress.city}, ${order.shippingAddress.postalCode}<br>
                            Tel: ${order.shippingAddress.phone}
                        </p>

                        <h3>Método de Pago:</h3>
                        <p style="background: white; padding: 15px; border-radius: 6px;">
                            ${order.paymentMethod === 'tarjeta' ? '💳 Tarjeta de Crédito/Débito' : 
                              order.paymentMethod === 'transferencia' ? '🏦 Transferencia Bancaria' : 
                              '💵 Contrareembolso'}
                        </p>

                        <center>
                            <a href="${process.env.FRONTEND_URL || 'http://localhost:5173'}/dashboard/user" class="button">
                                Ver Mi Pedido
                            </a>
                        </center>

                        <p>Te mantendremos informado sobre el estado de tu pedido.</p>
                        <p>¡Gracias por confiar en ElectroMartinez! 🎉</p>
                    </div>
                    <div class="footer">
                        <p>ElectroMartinez - Los mejores electrodomésticos</p>
                        <p>Este email fue enviado a ${userEmail}</p>
                    </div>
                </div>
            </body>
            </html>
        `
    };
};

// Plantilla de email de cambio de estado de pedido
const orderStatusEmail = (userName, userEmail, orderNumber, oldStatus, newStatus) => {
    const statusMessages = {
        'confirmado': { emoji: '✅', message: 'Tu pedido ha sido confirmado y está siendo preparado.' },
        'procesando': { emoji: '📦', message: 'Tu pedido está siendo procesado en nuestro almacén.' },
        'enviado': { emoji: '🚚', message: 'Tu pedido ha sido enviado y está en camino.' },
        'entregado': { emoji: '🎉', message: '¡Tu pedido ha sido entregado! Esperamos que lo disfrutes.' },
        'cancelado': { emoji: '❌', message: 'Tu pedido ha sido cancelado. Si tienes dudas, contáctanos.' }
    };

    const statusInfo = statusMessages[newStatus] || { emoji: '📋', message: 'El estado de tu pedido ha cambiado.' };

    return {
        from: process.env.EMAIL_FROM || 'ElectroMartinez <onboarding@resend.dev>',
        to: userEmail,
        subject: `${statusInfo.emoji} Actualización de Pedido #${orderNumber}`,
        html: `
            <!DOCTYPE html>
            <html>
            <head>
                <style>
                    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
                    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                    .header { background: linear-gradient(135deg, #FDB913 0%, #f59e0b 100%); color: #1a1a1a; padding: 30px; text-align: center; border-radius: 8px 8px 0 0; }
                    .content { background: #f9fafb; padding: 30px; border-radius: 0 0 8px 8px; }
                    .status-box { background: white; padding: 20px; border-radius: 6px; text-align: center; margin: 20px 0; border: 2px solid #FDB913; }
                    .button { display: inline-block; background: #FDB913; color: #1a1a1a; padding: 12px 30px; text-decoration: none; border-radius: 6px; margin: 20px 0; font-weight: bold; }
                    .footer { text-align: center; margin-top: 20px; color: #6b7280; font-size: 14px; }
                </style>
            </head>
            <body>
                <div class="container">
                    <div class="header">
                        <h1>${statusInfo.emoji} Actualización de Pedido</h1>
                    </div>
                    <div class="content">
                        <p>Hola <strong>${userName}</strong>,</p>
                        
                        <div class="status-box">
                            <h2 style="margin: 0 0 10px 0; color: #FDB913;">Pedido #${orderNumber}</h2>
                            <p style="font-size: 18px; margin: 10px 0;">
                                Estado: <strong style="text-transform: uppercase; color: #059669;">${newStatus}</strong>
                            </p>
                        </div>

                        <p style="font-size: 16px; background: white; padding: 15px; border-radius: 6px;">
                            ${statusInfo.message}
                        </p>

                        <center>
                            <a href="${process.env.FRONTEND_URL || 'http://localhost:5173'}/dashboard/user" class="button">
                                Ver Detalles del Pedido
                            </a>
                        </center>

                        <p>Si tienes alguna pregunta, no dudes en contactarnos.</p>
                    </div>
                    <div class="footer">
                        <p>ElectroMartinez - Los mejores electrodomésticos</p>
                        <p>Este email fue enviado a ${userEmail}</p>
                    </div>
                </div>
            </body>
            </html>
        `
    };
};

// Función para enviar email con Resend
const sendEmail = async (emailOptions) => {
    try {
        // Verificar que tenemos API key
        if (!process.env.RESEND_API_KEY) {
            console.warn('⚠️ RESEND_API_KEY no configurado - email no enviado');
            return { success: false, error: 'API key no configurada' };
        }

        const { data, error } = await resend.emails.send(emailOptions);
        
        if (error) {
            console.error('❌ Error enviando email:', error);
            return { success: false, error: error.message };
        }

        console.log('✅ Email enviado:', data.id);
        return { success: true, messageId: data.id };
    } catch (error) {
        console.error('❌ Error enviando email:', error);
        return { success: false, error: error.message };
    }
};

// Plantilla de email de confirmación de devolución
const returnConfirmationEmail = (userName, userEmail, returnRequest) => {
    const productsHtml = returnRequest.items.map(item => `
        <tr>
            <td style="padding: 10px; border-bottom: 1px solid #e5e7eb;">${item.name}</td>
            <td style="padding: 10px; border-bottom: 1px solid #e5e7eb; text-align: center;">${item.quantity}</td>
            <td style="padding: 10px; border-bottom: 1px solid #e5e7eb;">${item.reason || 'No especificado'}</td>
        </tr>
    `).join('');

    return {
        from: process.env.EMAIL_FROM || 'ElectroMartinez <onboarding@resend.dev>',
        to: userEmail,
        subject: `Solicitud de Devolución ${returnRequest.returnNumber} 📦`,
        html: `
            <!DOCTYPE html>
            <html>
            <head>
                <style>
                    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
                    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                    .header { background: linear-gradient(135deg, #6366f1 0%, #4f46e5 100%); color: white; padding: 30px; text-align: center; border-radius: 8px 8px 0 0; }
                    .content { background: #f9fafb; padding: 30px; }
                    .return-number { background: white; padding: 15px; border-radius: 6px; text-align: center; margin: 20px 0; border: 2px dashed #6366f1; }
                    .table { width: 100%; background: white; border-radius: 6px; margin: 20px 0; }
                    .steps { background: white; padding: 20px; border-radius: 6px; margin: 20px 0; }
                    .button { display: inline-block; background: #FDB913; color: #1a1a1a; padding: 12px 30px; text-decoration: none; border-radius: 6px; margin: 20px 0; font-weight: bold; }
                    .footer { text-align: center; margin-top: 20px; color: #6b7280; font-size: 14px; }
                </style>
            </head>
            <body>
                <div class="container">
                    <div class="header">
                        <h1>📦 Solicitud de Devolución Recibida</h1>
                    </div>
                    <div class="content">
                        <p>Hola <strong>${userName}</strong>,</p>
                        <p>Hemos recibido tu solicitud de devolución. Nuestro equipo la revisará y te contactaremos pronto.</p>
                        
                        <div class="return-number">
                            <h2 style="margin: 0; color: #6366f1;">${returnRequest.returnNumber}</h2>
                            <p style="margin: 5px 0 0 0; color: #6b7280;">Número de devolución</p>
                        </div>

                        <h3>Productos a Devolver:</h3>
                        <table class="table" cellpadding="0" cellspacing="0">
                            <thead>
                                <tr style="background: #f3f4f6;">
                                    <th style="padding: 10px; text-align: left;">Producto</th>
                                    <th style="padding: 10px; text-align: center;">Cantidad</th>
                                    <th style="padding: 10px; text-align: left;">Motivo</th>
                                </tr>
                            </thead>
                            <tbody>
                                ${productsHtml}
                            </tbody>
                        </table>

                        <div class="steps">
                            <h3>Próximos Pasos:</h3>
                            <ol>
                                <li>Revisaremos tu solicitud en 24-48 horas</li>
                                <li>Si es aprobada, recibirás instrucciones de envío</li>
                                <li>Una vez recibido el producto, procesaremos el reembolso</li>
                            </ol>
                        </div>

                        <center>
                            <a href="${process.env.FRONTEND_URL || 'http://localhost:5173'}/dashboard/user" class="button">
                                Ver Estado de Devolución
                            </a>
                        </center>

                        <p>Si tienes alguna pregunta, responde a este email o contáctanos.</p>
                    </div>
                    <div class="footer">
                        <p>ElectroMartinez - Los mejores electrodomésticos</p>
                    </div>
                </div>
            </body>
            </html>
        `
    };
};

// Plantilla de email de actualización de estado de devolución
const returnStatusEmail = (userName, userEmail, returnNumber, newStatus, additionalInfo = {}) => {
    const statusMessages = {
        'aprobada': { 
            emoji: '✅', 
            message: 'Tu devolución ha sido aprobada. Por favor, envía los productos siguiendo las instrucciones.',
            color: '#10b981'
        },
        'recibida': { 
            emoji: '📬', 
            message: 'Hemos recibido los productos de tu devolución. Procederemos a inspeccionarlos.',
            color: '#3b82f6'
        },
        'inspeccion': { 
            emoji: '🔍', 
            message: 'Estamos inspeccionando los productos. Te informaremos del resultado pronto.',
            color: '#f59e0b'
        },
        'reembolsada': { 
            emoji: '💰', 
            message: `¡Tu reembolso ha sido procesado! Recibirás ${additionalInfo.refundAmount?.toFixed(2) || 'el importe'} € en tu método de pago original.`,
            color: '#10b981'
        },
        'rechazada': { 
            emoji: '❌', 
            message: `Tu devolución ha sido rechazada. Motivo: ${additionalInfo.rejectReason || 'No especificado'}`,
            color: '#ef4444'
        },
        'cancelada': { 
            emoji: '🚫', 
            message: 'Tu solicitud de devolución ha sido cancelada.',
            color: '#6b7280'
        }
    };

    const statusInfo = statusMessages[newStatus] || { emoji: '📋', message: 'El estado de tu devolución ha cambiado.', color: '#6366f1' };

    return {
        from: process.env.EMAIL_FROM || 'ElectroMartinez <onboarding@resend.dev>',
        to: userEmail,
        subject: `${statusInfo.emoji} Actualización Devolución ${returnNumber}`,
        html: `
            <!DOCTYPE html>
            <html>
            <head>
                <style>
                    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
                    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                    .header { background: linear-gradient(135deg, ${statusInfo.color} 0%, ${statusInfo.color}dd 100%); color: white; padding: 30px; text-align: center; border-radius: 8px 8px 0 0; }
                    .content { background: #f9fafb; padding: 30px; border-radius: 0 0 8px 8px; }
                    .status-box { background: white; padding: 20px; border-radius: 6px; text-align: center; margin: 20px 0; border: 2px solid ${statusInfo.color}; }
                    .button { display: inline-block; background: #FDB913; color: #1a1a1a; padding: 12px 30px; text-decoration: none; border-radius: 6px; margin: 20px 0; font-weight: bold; }
                    .footer { text-align: center; margin-top: 20px; color: #6b7280; font-size: 14px; }
                </style>
            </head>
            <body>
                <div class="container">
                    <div class="header">
                        <h1>${statusInfo.emoji} Actualización de Devolución</h1>
                    </div>
                    <div class="content">
                        <p>Hola <strong>${userName}</strong>,</p>
                        
                        <div class="status-box">
                            <h2 style="margin: 0 0 10px 0; color: ${statusInfo.color};">${returnNumber}</h2>
                            <p style="font-size: 18px; margin: 10px 0;">
                                Estado: <strong style="text-transform: uppercase; color: ${statusInfo.color};">${newStatus}</strong>
                            </p>
                        </div>

                        <p style="font-size: 16px; background: white; padding: 15px; border-radius: 6px;">
                            ${statusInfo.message}
                        </p>

                        ${newStatus === 'aprobada' && additionalInfo.returnLabel ? `
                            <div style="background: #dbeafe; padding: 15px; border-radius: 6px; margin: 20px 0;">
                                <h4 style="margin: 0 0 10px 0;">📋 Instrucciones de Envío:</h4>
                                <p style="margin: 0;">Descarga la etiqueta de devolución desde tu cuenta y pégala en el paquete.</p>
                            </div>
                        ` : ''}

                        ${newStatus === 'reembolsada' ? `
                            <div style="background: #d1fae5; padding: 15px; border-radius: 6px; margin: 20px 0;">
                                <h4 style="margin: 0 0 10px 0;">💳 Detalles del Reembolso:</h4>
                                <p style="margin: 0;">
                                    Importe: <strong>${additionalInfo.refundAmount?.toFixed(2) || 'N/A'}€</strong><br>
                                    Método: ${additionalInfo.refundMethod || 'Método de pago original'}
                                </p>
                            </div>
                        ` : ''}

                        <center>
                            <a href="${process.env.FRONTEND_URL || 'http://localhost:5173'}/dashboard/user" class="button">
                                Ver Detalles
                            </a>
                        </center>

                        <p>Si tienes alguna pregunta, no dudes en contactarnos.</p>
                    </div>
                    <div class="footer">
                        <p>ElectroMartinez - Los mejores electrodomésticos</p>
                    </div>
                </div>
            </body>
            </html>
        `
    };
};

// Plantilla de email con factura adjunta
const invoiceEmail = (userName, userEmail, orderNumber) => ({
    from: process.env.EMAIL_FROM || 'ElectroMartinez <onboarding@resend.dev>',
    to: userEmail,
    subject: `Factura del Pedido #${orderNumber} 📄`,
    html: `
        <!DOCTYPE html>
        <html>
        <head>
            <style>
                body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
                .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                .header { background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%); color: white; padding: 30px; text-align: center; border-radius: 8px 8px 0 0; }
                .content { background: #f9fafb; padding: 30px; border-radius: 0 0 8px 8px; }
                .button { display: inline-block; background: #FDB913; color: #1a1a1a; padding: 12px 30px; text-decoration: none; border-radius: 6px; margin: 20px 0; font-weight: bold; }
                .footer { text-align: center; margin-top: 20px; color: #6b7280; font-size: 14px; }
            </style>
        </head>
        <body>
            <div class="container">
                <div class="header">
                    <h1>📄 Tu Factura</h1>
                </div>
                <div class="content">
                    <p>Hola <strong>${userName}</strong>,</p>
                    <p>Adjuntamos la factura correspondiente a tu pedido <strong>#${orderNumber}</strong>.</p>
                    
                    <p>Puedes descargar tu factura desde tu cuenta o consultarla en el archivo adjunto a este email.</p>

                    <center>
                        <a href="${process.env.FRONTEND_URL || 'http://localhost:5173'}/dashboard/user" class="button">
                            Ver Mi Pedido
                        </a>
                    </center>

                    <p>Gracias por tu compra.</p>
                </div>
                <div class="footer">
                    <p>ElectroMartinez - Los mejores electrodomésticos</p>
                </div>
            </div>
        </body>
        </html>
    `
});

// Función para enviar email con adjunto (factura PDF)
const sendEmailWithAttachment = async (emailOptions, attachment) => {
    try {
        if (!process.env.RESEND_API_KEY) {
            console.warn('⚠️ RESEND_API_KEY no configurado - email no enviado');
            return { success: false, error: 'API key no configurada' };
        }

        const emailData = {
            ...emailOptions,
            attachments: [{
                filename: attachment.filename,
                content: attachment.content.toString('base64')
            }]
        };

        const { data, error } = await resend.emails.send(emailData);
        
        if (error) {
            console.error('❌ Error enviando email con adjunto:', error);
            return { success: false, error: error.message };
        }

        console.log('✅ Email con adjunto enviado:', data.id);
        return { success: true, messageId: data.id };
    } catch (error) {
        console.error('❌ Error enviando email con adjunto:', error);
        return { success: false, error: error.message };
    }
};

module.exports = {
    sendEmail,
    sendEmailWithAttachment,
    welcomeEmail,
    orderConfirmationEmail,
    orderStatusEmail,
    returnConfirmationEmail,
    returnStatusEmail,
    invoiceEmail
};
