const Brand = require('../models/Brand');

module.exports = async (req, res, next) => {
    try {
        const brand = await Brand.findById(req.params.brandId);
        
        if (!brand) {
            return res.status(404).json({
                error: 'Brand not found'
            });
        }
        
        req.brand = brand;
        next();
    } catch (error) {
        console.error('Error in brandById middleware:', error);
        return res.status(400).json({
            error: 'Invalid Brand ID'
        });
    }
};
