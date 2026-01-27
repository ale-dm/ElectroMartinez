const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
const Product = require('../models/Product');
const Coupon = require('../models/Coupon');
const Notification = require('../models/Notification');
const User = require('../models/User');
const auth = require('../middleware/auth');
const adminAuth = require('../middleware/adminAuth');
const { sendEmail, sendEmailWithAttachment, orderConfirmationEmail, orderStatusEmail, invoiceEmail } = require('../services/emailService');
const { generateInvoice } = require('../services/pdfService');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

// @route   POST /api/order/create-payment-intent
// @desc    Crear payment intent de Stripe
// @access  Private
router.post('/create-payment-intent', auth, async (req, res) => {
    try {
        const { amount } = req.body;

        if (!amount || amount <= 0) {
            return res.status(400).json({ msg: 'Monto inválido' });
        }

        // Crear payment intent en Stripe
        const paymentIntent = await stripe.paymentIntents.create({
            amount: Math.round(amount * 100), // Convertir a centavos
            currency: 'eur',
            automatic_payment_methods: {
                enabled: true,
            },
            metadata: {
                user_id: req.user.id
            }
        });

        res.json({
            clientSecret: paymentIntent.client_secret
        });
    } catch (error) {
        console.error('Error al crear payment intent:', error);
        res.status(500).json({ msg: 'Error al procesar el pago' });
    }
});

// @route   POST /api/order
// @desc    Crear nuevo pedido
// @access  Private
router.post('/', auth, async (req, res) => {
    try {
        const { items, shippingAddress, paymentMethod, stripePaymentMethodId, couponCode } = req.body;

        if (!items || items.length === 0) {
            return res.status(400).json({ msg: 'No hay productos en el pedido' });
        }

        // Calcular precios
        let itemsPrice = 0;
        const orderItems = [];

        // Verificar stock y calcular precio
        for (const item of items) {
            const product = await Product.findById(item.product);
            
            if (!product) {
                return res.status(404).json({ msg: `Producto ${item.name} no encontrado` });
            }

            if (product.quantity < item.quantity) {
                return res.status(400).json({ 
                    msg: `Stock insuficiente para ${product.name}. Disponible: ${product.quantity}` 
                });
            }

            itemsPrice += item.price * item.quantity;

            orderItems.push({
                product: product._id,
                name: product.name,
                quantity: item.quantity,
                price: item.price,
                image: product.images && product.images.length > 0 ? product.images[0].url : null
            });
        }

        // Validar y aplicar cupón si existe
        let couponData = null;
        let discountAmount = 0;

        if (couponCode) {
            const coupon = await Coupon.findOne({ code: couponCode.toUpperCase() });
            
            if (coupon) {
                const validation = coupon.isValid();
                if (validation.valid) {
                    const discountResult = coupon.calculateDiscount(itemsPrice);
                    if (discountResult.applicable) {
                        discountAmount = discountResult.discount;
                        couponData = {
                            code: coupon.code,
                            discount: coupon.discount,
                            type: coupon.type
                        };
                    }
                }
            }
        }

        // Calcular envío y tax (IVA del 21%)
        const shippingPrice = 0; // Envío gratis
        const subtotalAfterDiscount = itemsPrice - discountAmount;
        const taxPrice = subtotalAfterDiscount * 0.21;
        const totalPrice = subtotalAfterDiscount + shippingPrice + taxPrice;

        // Crear orden
        const orderData = {
            user: req.user.id,
            items: orderItems,
            shippingAddress,
            paymentMethod,
            stripePaymentMethodId: stripePaymentMethodId || null,
            discountAmount: Number(discountAmount.toFixed(2)),
            // Si viene de Stripe, marcar como pagado
            paymentStatus: stripePaymentMethodId ? 'pagado' : 'pendiente',
            itemsPrice: Number(itemsPrice.toFixed(2)),
            shippingPrice: Number(shippingPrice.toFixed(2)),
            taxPrice: Number(taxPrice.toFixed(2)),
            totalPrice: Number(totalPrice.toFixed(2))
        };

        // Solo añadir coupon si existe
        if (couponData) {
            orderData.coupon = couponData;
        }

        const order = new Order(orderData);

        await order.save();

        // Reducir stock de productos
        for (const item of items) {
            await Product.findByIdAndUpdate(
                item.product,
                { $inc: { quantity: -item.quantity } }
            );
        }

        // Poblar información del pedido
        await order.populate('user', 'name email');
        await order.populate('items.product', 'name sku');

        // Enviar email de confirmación (sin bloquear la respuesta)
        if (process.env.RESEND_API_KEY) {
            const emailData = {
                orderNumber: order.orderNumber,
                products: order.items.map(item => ({
                    name: item.name,
                    quantity: item.quantity,
                    price: item.price
                })),
                totalPrice: order.totalPrice,
                shippingAddress: order.shippingAddress,
                paymentMethod: order.paymentMethod
            };
            
            sendEmail(orderConfirmationEmail(order.user.name, order.user.email, emailData))
                .catch(err => console.error('Error enviando email de confirmación:', err));
        }

        // Crear notificación para el usuario
        await Notification.create({
            user: req.user.id,
            type: 'order_status',
            title: '✅ Pedido confirmado',
            message: `Tu pedido ${order.orderNumber} ha sido creado correctamente. Total: ${order.totalPrice.toFixed(2)}€`,
            link: `/dashboard/user`,
            relatedOrder: order._id
        });

        res.status(201).json(order);
    } catch (error) {
        console.error('Error al crear pedido:', error);
        res.status(500).json({ msg: 'Error del servidor' });
    }
});

// @route   GET /api/order/user
// @desc    Obtener pedidos del usuario autenticado
// @access  Private
router.get('/user', auth, async (req, res) => {
    try {
        const orders = await Order.find({ user: req.user.id })
            .populate('items.product', 'name images')
            .sort({ createdAt: -1 });

        res.json(orders);
    } catch (error) {
        console.error('Error al obtener pedidos:', error);
        res.status(500).json({ msg: 'Error del servidor' });
    }
});

// @route   GET /api/order/:id/invoice
// @desc    Descargar factura en PDF
// @access  Private
router.get('/:id/invoice', auth, async (req, res) => {
    try {
        const order = await Order.findById(req.params.id)
            .populate('user', 'name email');

        if (!order) {
            return res.status(404).json({ msg: 'Pedido no encontrado' });
        }

        // Verificar que el pedido pertenece al usuario o que es admin
        if (order.user._id.toString() !== req.user.id && req.user.role !== 1) {
            return res.status(403).json({ msg: 'No autorizado' });
        }

        // Generar PDF
        const pdfBuffer = await generateInvoice(order);

        res.set({
            'Content-Type': 'application/pdf',
            'Content-Disposition': `attachment; filename=factura-${order.orderNumber}.pdf`,
            'Content-Length': pdfBuffer.length
        });

        res.send(pdfBuffer);
    } catch (error) {
        console.error('Error al generar factura:', error);
        res.status(500).json({ msg: 'Error al generar factura' });
    }
});

// @route   POST /api/order/:id/send-invoice
// @desc    Enviar factura por email
// @access  Private
router.post('/:id/send-invoice', auth, async (req, res) => {
    try {
        const order = await Order.findById(req.params.id)
            .populate('user', 'name email');

        if (!order) {
            return res.status(404).json({ msg: 'Pedido no encontrado' });
        }

        // Verificar que el pedido pertenece al usuario o que es admin
        if (order.user._id.toString() !== req.user.id && req.user.role !== 1) {
            return res.status(403).json({ msg: 'No autorizado' });
        }

        // Generar PDF
        const pdfBuffer = await generateInvoice(order);

        // Enviar email con adjunto
        const emailTemplate = invoiceEmail(order.user.name, order.user.email, order.orderNumber);
        const result = await sendEmailWithAttachment(emailTemplate, {
            filename: `factura-${order.orderNumber}.pdf`,
            content: pdfBuffer
        });

        if (!result.success) {
            return res.status(500).json({ msg: 'Error al enviar email' });
        }

        res.json({ msg: 'Factura enviada por email correctamente' });
    } catch (error) {
        console.error('Error al enviar factura:', error);
        res.status(500).json({ msg: 'Error al enviar factura' });
    }
});

// @route   GET /api/order/:id
// @desc    Obtener detalle de un pedido
// @access  Private
router.get('/:id', auth, async (req, res) => {
    try {
        const order = await Order.findById(req.params.id)
            .populate('user', 'name email')
            .populate('items.product', 'name sku images');

        if (!order) {
            return res.status(404).json({ msg: 'Pedido no encontrado' });
        }

        // Verificar que el pedido pertenece al usuario o que es admin
        if (order.user._id.toString() !== req.user.id && req.user.role !== 1) {
            return res.status(403).json({ msg: 'No autorizado' });
        }

        res.json(order);
    } catch (error) {
        console.error('Error al obtener pedido:', error);
        if (error.kind === 'ObjectId') {
            return res.status(404).json({ msg: 'Pedido no encontrado' });
        }
        res.status(500).json({ msg: 'Error del servidor' });
    }
});

// @route   GET /api/order
// @desc    Obtener todos los pedidos (admin)
// @access  Private/Admin
router.get('/', [auth, adminAuth], async (req, res) => {
    try {
        const orders = await Order.find()
            .populate('user', 'name email')
            .populate('items.product', 'name sku')
            .sort({ createdAt: -1 });

        res.json(orders);
    } catch (error) {
        console.error('Error al obtener pedidos:', error);
        res.status(500).json({ msg: 'Error del servidor' });
    }
});

// @route   PUT /api/order/:id/status
// @desc    Actualizar estado del pedido (admin)
// @access  Private/Admin
router.put('/:id/status', [auth, adminAuth], async (req, res) => {
    try {
        const { orderStatus, trackingNumber } = req.body;

        const order = await Order.findById(req.params.id).populate('user', 'name email');

        if (!order) {
            return res.status(404).json({ msg: 'Pedido no encontrado' });
        }

        const oldStatus = order.orderStatus;

        if (orderStatus) {
            order.orderStatus = orderStatus;
            
            // Si se marca como entregado, guardar fecha
            if (orderStatus === 'entregado' && !order.deliveredAt) {
                order.deliveredAt = Date.now();
            }
        }

        if (trackingNumber) {
            order.trackingNumber = trackingNumber;
        }

        await order.save();

        // Enviar email de cambio de estado (si el estado cambió)
        if (orderStatus && oldStatus !== orderStatus) {
            // Email
            if (process.env.RESEND_API_KEY) {
                sendEmail(orderStatusEmail(
                    order.user.name,
                    order.user.email,
                    order.orderNumber,
                    oldStatus,
                    orderStatus
                )).catch(err => console.error('Error enviando email de estado:', err));
            }

            // Crear notificación
            const statusMessages = {
                'pendiente': '⏳ Tu pedido está pendiente',
                'confirmado': '✅ Tu pedido ha sido confirmado',
                'procesando': '📦 Tu pedido está siendo preparado',
                'enviado': '🚚 Tu pedido ha sido enviado',
                'entregado': '🎉 Tu pedido ha sido entregado',
                'cancelado': '❌ Tu pedido ha sido cancelado'
            };

            await Notification.create({
                user: order.user._id,
                type: 'order_status',
                title: statusMessages[orderStatus] || 'Actualización de pedido',
                message: `El estado de tu pedido ${order.orderNumber} ha cambiado a: ${orderStatus}${trackingNumber ? ` - Número de seguimiento: ${trackingNumber}` : ''}`,
                link: `/dashboard/user`,
                relatedOrder: order._id
            });
        }

        await order.populate('items.product', 'name sku');

        res.json(order);
    } catch (error) {
        console.error('Error al actualizar pedido:', error);
        if (error.kind === 'ObjectId') {
            return res.status(404).json({ msg: 'Pedido no encontrado' });
        }
        res.status(500).json({ msg: 'Error del servidor' });
    }
});

// @route   PUT /api/order/:id/payment
// @desc    Actualizar estado de pago (admin)
// @access  Private/Admin
router.put('/:id/payment', [auth, adminAuth], async (req, res) => {
    try {
        const { paymentStatus } = req.body;

        const order = await Order.findById(req.params.id);

        if (!order) {
            return res.status(404).json({ msg: 'Pedido no encontrado' });
        }

        order.paymentStatus = paymentStatus;
        await order.save();

        res.json(order);
    } catch (error) {
        console.error('Error al actualizar pago:', error);
        res.status(500).json({ msg: 'Error del servidor' });
    }
});

module.exports = router;
