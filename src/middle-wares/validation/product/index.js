const appRoot = require('app-root-path');
const Product = require(appRoot + '/src/models/product');
const _get = require('lodash.get');
const appConstants = require(appRoot + '/src/constants/app-constants');
const { status, messages } = appConstants;

// In this method we will validate booking

exports.validateProduct = async (req, res, next) => {
    try {
        let productId;
        if (_get(req, 'body._id')) {
            productId = _get(req, 'body._id')
        }
        if (_get(req, 'params.id')) {
            productId = _get(req, 'params.id')
        }
        if (_get(req, 'query.id')) {
            productId = _get(req, 'query.id')
        }
        if (productId) {
            const productToFind = await Product.findById(productId);
            if (!productToFind) {
                return res.status(status.notFound).json({
                    message: `Sorry, we couldn't find Product for the requested ID`
                });
            }
        }
        next();
    } catch (error) {
        return res.status(status.serverError).json({
            message: messages.serverErrorMessage,
            error
        });
    }
}