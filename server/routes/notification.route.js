const express = require('express');
const router = express.Router();
const Notification = require('../models/Notification');
const auth = require('../middleware/auth');

// @route   GET api/notification
// @desc    Get user notifications
// @access  Private
router.get('/', auth, async (req, res) => {
    try {
        const { limit = 20, unreadOnly = 'false' } = req.query;
        
        const query = { user: req.user.id };
        if (unreadOnly === 'true') {
            query.isRead = false;
        }

        const notifications = await Notification.find(query)
            .sort({ createdAt: -1 })
            .limit(parseInt(limit))
            .populate('relatedOrder', 'orderNumber')
            .populate('relatedProduct', 'name images');

        res.json(notifications);
    } catch (error) {
        console.error('Error al obtener notificaciones:', error);
        res.status(500).json({ error: 'Error del servidor' });
    }
});

// @route   GET api/notification/unread-count
// @desc    Get unread notifications count
// @access  Private
router.get('/unread-count', auth, async (req, res) => {
    try {
        const count = await Notification.countDocuments({
            user: req.user.id,
            isRead: false
        });

        res.json({ count });
    } catch (error) {
        console.error('Error al contar notificaciones:', error);
        res.status(500).json({ error: 'Error del servidor' });
    }
});

// @route   PUT api/notification/:id/read
// @desc    Mark notification as read
// @access  Private
router.put('/:id/read', auth, async (req, res) => {
    try {
        const notification = await Notification.findOne({
            _id: req.params.id,
            user: req.user.id
        });

        if (!notification) {
            return res.status(404).json({ error: 'Notificación no encontrada' });
        }

        notification.isRead = true;
        await notification.save();

        res.json(notification);
    } catch (error) {
        console.error('Error al marcar notificación:', error);
        res.status(500).json({ error: 'Error del servidor' });
    }
});

// @route   PUT api/notification/read-all
// @desc    Mark all notifications as read
// @access  Private
router.put('/read-all', auth, async (req, res) => {
    try {
        await Notification.updateMany(
            { user: req.user.id, isRead: false },
            { $set: { isRead: true } }
        );

        res.json({ message: 'Todas las notificaciones marcadas como leídas' });
    } catch (error) {
        console.error('Error al marcar todas las notificaciones:', error);
        res.status(500).json({ error: 'Error del servidor' });
    }
});

// @route   DELETE api/notification/:id
// @desc    Delete notification
// @access  Private
router.delete('/:id', auth, async (req, res) => {
    try {
        const notification = await Notification.findOneAndDelete({
            _id: req.params.id,
            user: req.user.id
        });

        if (!notification) {
            return res.status(404).json({ error: 'Notificación no encontrada' });
        }

        res.json({ message: 'Notificación eliminada' });
    } catch (error) {
        console.error('Error al eliminar notificación:', error);
        res.status(500).json({ error: 'Error del servidor' });
    }
});

// Helper function para crear notificaciones (usada por otras rutas)
const createNotification = async (data) => {
    try {
        const notification = new Notification(data);
        await notification.save();
        return notification;
    } catch (error) {
        console.error('Error creating notification:', error);
        throw error;
    }
};

module.exports = router;
module.exports.createNotification = createNotification;
