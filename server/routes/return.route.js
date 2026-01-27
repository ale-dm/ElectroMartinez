const express = require('express');
const router = express.Router();
const Return = require('../models/Return');
const Order = require('../models/Order');
const auth = require('../middleware/auth');
const adminAuth = require('../middleware/adminAuth');
const { sendEmail, returnConfirmationEmail, returnStatusEmail } = require('../services/emailService');
const { generateReturnLabel } = require('../services/pdfService');

// @route   POST /api/returns
// @desc    Crear solicitud de devolución
// @access  Private
router.post('/', auth, async (req, res) => {
    try {
        const { orderId, items, reason, description } = req.body;

        // Verificar que el pedido existe y pertenece al usuario
        const order = await Order.findById(orderId).populate('user', 'name email');
        
        if (!order) {
            return res.status(404).json({ message: 'Pedido no encontrado' });
        }

        if (order.user._id.toString() !== req.user.id) {
            return res.status(403).json({ message: 'No autorizado' });
        }

        // Verificar que el pedido está entregado
        if (!['entregado'].includes(order.orderStatus)) {
            return res.status(400).json({ 
                message: 'Solo se pueden devolver pedidos entregados' 
            });
        }

        // Verificar que está dentro del plazo de devolución (30 días)
        const deliveredDate = order.deliveredAt || order.updatedAt;
        const daysSinceDelivery = Math.floor((Date.now() - new Date(deliveredDate)) / (1000 * 60 * 60 * 24));
        
        if (daysSinceDelivery > 30) {
            return res.status(400).json({ 
                message: 'El plazo de devolución de 30 días ha expirado' 
            });
        }

        // Verificar que no existe una devolución activa para este pedido
        const existingReturn = await Return.findOne({ 
            order: orderId, 
            status: { $nin: ['rechazada', 'cancelada', 'reembolsada'] } 
        });

        if (existingReturn) {
            return res.status(400).json({ 
                message: 'Ya existe una solicitud de devolución para este pedido',
                returnNumber: existingReturn.returnNumber
            });
        }

        // Validar que los items pertenecen al pedido
        const orderItemIds = order.items.map(item => item.product.toString());
        for (const item of items) {
            if (!orderItemIds.includes(item.product)) {
                return res.status(400).json({ 
                    message: 'Producto no encontrado en el pedido' 
                });
            }
        }

        // Calcular el monto de reembolso
        let refundAmount = 0;
        const returnItems = items.map(item => {
            const orderItem = order.items.find(oi => oi.product.toString() === item.product);
            const itemTotal = orderItem.price * item.quantity;
            refundAmount += itemTotal;
            
            return {
                product: item.product,
                name: orderItem.name,
                quantity: item.quantity,
                price: orderItem.price,
                image: orderItem.image,
                reason: item.reason || reason
            };
        });

        // Crear la devolución
        const returnRequest = new Return({
            user: req.user.id,
            order: orderId,
            items: returnItems,
            reason: reason,
            description: description,
            refundAmount: refundAmount,
            refundMethod: order.paymentMethod === 'contrareembolso' ? 'transferencia' : 'original'
        });

        await returnRequest.save();

        // Enviar email de confirmación
        try {
            const emailTemplate = returnConfirmationEmail(
                order.user.name,
                order.user.email,
                returnRequest
            );
            await sendEmail(emailTemplate);
        } catch (emailError) {
            console.error('Error enviando email de confirmación de devolución:', emailError);
        }

        res.status(201).json({
            success: true,
            message: 'Solicitud de devolución creada correctamente',
            return: returnRequest
        });

    } catch (error) {
        console.error('Error creando devolución:', error);
        res.status(500).json({ message: 'Error del servidor', error: error.message });
    }
});

// @route   GET /api/returns/user
// @desc    Obtener devoluciones del usuario
// @access  Private
router.get('/user', auth, async (req, res) => {
    try {
        const returns = await Return.find({ user: req.user.id })
            .populate('order', 'orderNumber totalPrice createdAt')
            .sort({ createdAt: -1 });

        res.json(returns);
    } catch (error) {
        console.error('Error obteniendo devoluciones:', error);
        res.status(500).json({ message: 'Error del servidor' });
    }
});

// @route   GET /api/returns/:id
// @desc    Obtener detalle de una devolución
// @access  Private
router.get('/:id', auth, async (req, res) => {
    try {
        const returnRequest = await Return.findById(req.params.id)
            .populate('order', 'orderNumber totalPrice shippingAddress createdAt items')
            .populate('user', 'name email');

        if (!returnRequest) {
            return res.status(404).json({ message: 'Devolución no encontrada' });
        }

        // Verificar que pertenece al usuario (o es admin)
        if (returnRequest.user._id.toString() !== req.user.id && req.user.role !== 'admin') {
            return res.status(403).json({ message: 'No autorizado' });
        }

        res.json(returnRequest);
    } catch (error) {
        console.error('Error obteniendo devolución:', error);
        res.status(500).json({ message: 'Error del servidor' });
    }
});

// @route   GET /api/returns/:id/label
// @desc    Descargar etiqueta de devolución
// @access  Private
router.get('/:id/label', auth, async (req, res) => {
    try {
        const returnRequest = await Return.findById(req.params.id)
            .populate('order', 'orderNumber');

        if (!returnRequest) {
            return res.status(404).json({ message: 'Devolución no encontrada' });
        }

        // Verificar propiedad
        if (returnRequest.user.toString() !== req.user.id && req.user.role !== 'admin') {
            return res.status(403).json({ message: 'No autorizado' });
        }

        // Solo generar etiqueta si está aprobada
        if (!['aprobada', 'recibida', 'inspeccion', 'reembolsada'].includes(returnRequest.status)) {
            return res.status(400).json({ 
                message: 'La devolución debe estar aprobada para generar la etiqueta' 
            });
        }

        const pdfBuffer = await generateReturnLabel(returnRequest);

        res.set({
            'Content-Type': 'application/pdf',
            'Content-Disposition': `attachment; filename=etiqueta-${returnRequest.returnNumber}.pdf`,
            'Content-Length': pdfBuffer.length
        });

        res.send(pdfBuffer);
    } catch (error) {
        console.error('Error generando etiqueta:', error);
        res.status(500).json({ message: 'Error generando etiqueta' });
    }
});

// ============ RUTAS ADMIN ============

// @route   GET /api/returns/admin/all
// @desc    Obtener todas las devoluciones (Admin)
// @access  Admin
router.get('/admin/all', [auth, adminAuth], async (req, res) => {
    try {
        const { status, page = 1, limit = 20 } = req.query;
        
        const query = {};
        if (status) query.status = status;

        const returns = await Return.find(query)
            .populate('user', 'name email')
            .populate('order', 'orderNumber totalPrice')
            .sort({ createdAt: -1 })
            .skip((page - 1) * limit)
            .limit(parseInt(limit));

        const total = await Return.countDocuments(query);

        res.json({
            returns,
            total,
            pages: Math.ceil(total / limit),
            currentPage: parseInt(page)
        });
    } catch (error) {
        console.error('Error obteniendo devoluciones (admin):', error);
        res.status(500).json({ message: 'Error del servidor' });
    }
});

// @route   PUT /api/returns/admin/:id/status
// @desc    Actualizar estado de devolución (Admin)
// @access  Admin
router.put('/admin/:id/status', [auth, adminAuth], async (req, res) => {
    try {
        const { status, adminNotes, refundAmount, rejectReason } = req.body;

        const returnRequest = await Return.findById(req.params.id)
            .populate('user', 'name email')
            .populate('order', 'orderNumber');

        if (!returnRequest) {
            return res.status(404).json({ message: 'Devolución no encontrada' });
        }

        const oldStatus = returnRequest.status;
        returnRequest.status = status;

        if (adminNotes) returnRequest.adminNotes = adminNotes;
        if (refundAmount) returnRequest.refundAmount = refundAmount;
        if (rejectReason) returnRequest.rejectReason = rejectReason;

        // Acciones según el nuevo estado
        if (status === 'aprobada') {
            returnRequest.approvedAt = new Date();
            returnRequest.approvedBy = req.user.id;
        }

        if (status === 'recibida') {
            returnRequest.returnShipping = {
                ...returnRequest.returnShipping,
                receivedAt: new Date()
            };
        }

        if (status === 'reembolsada') {
            returnRequest.refundStatus = 'completado';
            returnRequest.refundedAt = new Date();
        }

        if (status === 'rechazada') {
            returnRequest.rejectedAt = new Date();
            returnRequest.rejectedBy = req.user.id;
        }

        await returnRequest.save();

        // Enviar email de notificación
        try {
            const additionalInfo = {
                refundAmount: returnRequest.refundAmount,
                refundMethod: returnRequest.refundMethod,
                rejectReason: rejectReason,
                returnLabel: status === 'aprobada'
            };

            const emailTemplate = returnStatusEmail(
                returnRequest.user.name,
                returnRequest.user.email,
                returnRequest.returnNumber,
                status,
                additionalInfo
            );
            await sendEmail(emailTemplate);
        } catch (emailError) {
            console.error('Error enviando email de actualización:', emailError);
        }

        res.json({
            success: true,
            message: `Estado actualizado a ${status}`,
            return: returnRequest
        });

    } catch (error) {
        console.error('Error actualizando devolución:', error);
        res.status(500).json({ message: 'Error del servidor', error: error.message });
    }
});

// @route   PUT /api/returns/admin/:id/inspection
// @desc    Registrar inspección de productos (Admin)
// @access  Admin
router.put('/admin/:id/inspection', [auth, adminAuth], async (req, res) => {
    try {
        const { condition, notes, images } = req.body;

        const returnRequest = await Return.findById(req.params.id);

        if (!returnRequest) {
            return res.status(404).json({ message: 'Devolución no encontrada' });
        }

        returnRequest.inspection = {
            inspectedBy: req.user.id,
            inspectedAt: new Date(),
            condition,
            notes,
            images: images || []
        };

        returnRequest.status = 'inspeccion';
        await returnRequest.save();

        res.json({
            success: true,
            message: 'Inspección registrada',
            return: returnRequest
        });

    } catch (error) {
        console.error('Error registrando inspección:', error);
        res.status(500).json({ message: 'Error del servidor' });
    }
});

// @route   DELETE /api/returns/:id
// @desc    Cancelar solicitud de devolución
// @access  Private
router.delete('/:id', auth, async (req, res) => {
    try {
        const returnRequest = await Return.findById(req.params.id);

        if (!returnRequest) {
            return res.status(404).json({ message: 'Devolución no encontrada' });
        }

        // Verificar propiedad
        if (returnRequest.user.toString() !== req.user.id && req.user.role !== 'admin') {
            return res.status(403).json({ message: 'No autorizado' });
        }

        // Solo se puede cancelar si está pendiente
        if (returnRequest.status !== 'pendiente') {
            return res.status(400).json({ 
                message: 'Solo se pueden cancelar devoluciones pendientes' 
            });
        }

        returnRequest.status = 'cancelada';
        await returnRequest.save();

        res.json({
            success: true,
            message: 'Devolución cancelada'
        });

    } catch (error) {
        console.error('Error cancelando devolución:', error);
        res.status(500).json({ message: 'Error del servidor' });
    }
});

module.exports = router;
