const express = require('express');
const router = express.Router();
const Product = require('../models/Product');
const Category = require('../models/Category');
const User = require('../models/User');
const Order = require('../models/Order');
const auth = require('../middleware/auth');
const adminAuth = require('../middleware/adminAuth');

// @route   GET api/admin/stats
// @desc    Get admin dashboard statistics
// @access  Private Admin
router.get('/stats', auth, adminAuth, async (req, res) => {
    try {
        // Contar totales
        const totalProducts = await Product.countDocuments();
        const totalCategories = await Category.countDocuments();
        const totalUsers = await User.countDocuments();
        
        // Productos con stock bajo (menos de 5 unidades)
        const lowStockProducts = await Product.countDocuments({ 
            quantity: { $lt: 5, $gt: 0 } 
        });
        
        // Productos sin stock
        const outOfStockProducts = await Product.countDocuments({ 
            quantity: 0 
        });
        
        // Productos sin imágenes
        const productsWithoutImages = await Product.countDocuments({
            $or: [
                { images: { $exists: false } },
                { images: { $size: 0 } }
            ]
        });
        
        // Productos destacados
        const featuredProducts = await Product.countDocuments({ 
            featured: true 
        });
        
        // Últimos productos creados
        const recentProducts = await Product.find()
            .sort({ createdAt: -1 })
            .limit(5)
            .populate('category', 'name')
            .select('name price quantity images featured createdAt');
        
        // Productos con stock bajo (lista)
        const lowStockList = await Product.find({ 
            quantity: { $lt: 5, $gt: 0 } 
        })
            .sort({ quantity: 1 })
            .limit(10)
            .populate('category', 'name')
            .select('name quantity images');
        
        // Distribución de productos por categoría
        const productsByCategory = await Product.aggregate([
            {
                $group: {
                    _id: '$category',
                    count: { $sum: 1 }
                }
            },
            {
                $lookup: {
                    from: 'categories',
                    localField: '_id',
                    foreignField: '_id',
                    as: 'categoryInfo'
                }
            },
            {
                $unwind: '$categoryInfo'
            },
            {
                $project: {
                    name: '$categoryInfo.name',
                    count: 1
                }
            },
            {
                $sort: { count: -1 }
            }
        ]);

        res.json({
            totals: {
                products: totalProducts,
                categories: totalCategories,
                users: totalUsers,
                featuredProducts
            },
            alerts: {
                lowStock: lowStockProducts,
                outOfStock: outOfStockProducts,
                withoutImages: productsWithoutImages
            },
            recentProducts,
            lowStockList,
            productsByCategory
        });
    } catch (error) {
        console.error('Error fetching admin stats:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

// @route   GET api/admin/sales-stats
// @desc    Get sales statistics for charts
// @access  Private Admin
router.get('/sales-stats', auth, adminAuth, async (req, res) => {
    try {
        const { period = '7' } = req.query; // 7, 30, 90 días
        const daysAgo = parseInt(period);
        const startDate = new Date();
        startDate.setDate(startDate.getDate() - daysAgo);

        // Ventas por día
        const salesByDay = await Order.aggregate([
            {
                $match: {
                    createdAt: { $gte: startDate },
                    orderStatus: { $ne: 'cancelado' }
                }
            },
            {
                $group: {
                    _id: {
                        $dateToString: { format: "%Y-%m-%d", date: "$createdAt" }
                    },
                    count: { $sum: 1 },
                    revenue: { $sum: "$totalPrice" }
                }
            },
            { $sort: { _id: 1 } }
        ]);

        // Top 5 productos más vendidos
        const topProducts = await Order.aggregate([
            {
                $match: {
                    createdAt: { $gte: startDate },
                    orderStatus: { $ne: 'cancelado' }
                }
            },
            { $unwind: "$items" },
            {
                $group: {
                    _id: "$items.product",
                    name: { $first: "$items.name" },
                    quantity: { $sum: "$items.quantity" },
                    revenue: { $sum: { $multiply: ["$items.price", "$items.quantity"] } }
                }
            },
            { $sort: { quantity: -1 } },
            { $limit: 5 }
        ]);

        // Ventas por categoría
        const salesByCategory = await Order.aggregate([
            {
                $match: {
                    createdAt: { $gte: startDate },
                    orderStatus: { $ne: 'cancelado' }
                }
            },
            { $unwind: "$items" },
            {
                $lookup: {
                    from: 'products',
                    localField: 'items.product',
                    foreignField: '_id',
                    as: 'productInfo'
                }
            },
            { $unwind: { path: "$productInfo", preserveNullAndEmptyArrays: true } },
            {
                $lookup: {
                    from: 'categories',
                    localField: 'productInfo.category',
                    foreignField: '_id',
                    as: 'categoryInfo'
                }
            },
            { $unwind: { path: "$categoryInfo", preserveNullAndEmptyArrays: true } },
            {
                $group: {
                    _id: "$categoryInfo.name",
                    count: { $sum: "$items.quantity" },
                    revenue: { $sum: { $multiply: ["$items.price", "$items.quantity"] } }
                }
            },
            { $sort: { revenue: -1 } }
        ]);

        // Resumen del período
        const summary = await Order.aggregate([
            {
                $match: {
                    createdAt: { $gte: startDate },
                    orderStatus: { $ne: 'cancelado' }
                }
            },
            {
                $group: {
                    _id: null,
                    totalOrders: { $sum: 1 },
                    totalRevenue: { $sum: "$totalPrice" },
                    avgOrderValue: { $avg: "$totalPrice" }
                }
            }
        ]);

        // Estadísticas del mes actual vs mes anterior
        const currentMonthStart = new Date(new Date().getFullYear(), new Date().getMonth(), 1);
        const lastMonthStart = new Date(new Date().getFullYear(), new Date().getMonth() - 1, 1);
        const lastMonthEnd = new Date(new Date().getFullYear(), new Date().getMonth(), 0, 23, 59, 59);

        const currentMonthSales = await Order.aggregate([
            {
                $match: {
                    createdAt: { $gte: currentMonthStart },
                    orderStatus: { $ne: 'cancelado' }
                }
            },
            {
                $group: {
                    _id: null,
                    count: { $sum: 1 },
                    revenue: { $sum: "$totalPrice" }
                }
            }
        ]);

        const lastMonthSales = await Order.aggregate([
            {
                $match: {
                    createdAt: { $gte: lastMonthStart, $lte: lastMonthEnd },
                    orderStatus: { $ne: 'cancelado' }
                }
            },
            {
                $group: {
                    _id: null,
                    count: { $sum: 1 },
                    revenue: { $sum: "$totalPrice" }
                }
            }
        ]);

        res.json({
            salesByDay,
            topProducts,
            salesByCategory,
            summary: summary[0] || { totalOrders: 0, totalRevenue: 0, avgOrderValue: 0 },
            monthlyComparison: {
                current: currentMonthSales[0] || { count: 0, revenue: 0 },
                last: lastMonthSales[0] || { count: 0, revenue: 0 }
            }
        });
    } catch (error) {
        console.error('Error fetching sales stats:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

module.exports = router;
