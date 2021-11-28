const appRoot = require('app-root-path');
const express = require('express');
const router = express.Router();
const ProductValidations = require('./product.validation');
const ProductController = require('./product.controller');
const jwtValidations = require(appRoot + '/src/middle-wares/auth');
const ProductMiddleware = require(appRoot + '/src/middle-wares/validation/product');


router.get(
    '/all-products',
    [jwtValidations, ProductValidations.validateGetAllProduct],
    ProductController.getAllProducts
);

router.get(
    '/:id',
    [jwtValidations, ProductValidations.validateGetProductById, ProductMiddleware.validateProduct],
    ProductController.getProductById
);

router.post(
    '/',
    [jwtValidations, ProductValidations.validateCreateProduct],
    ProductController.createProduct
);

router.patch(
    '/:id',
    [jwtValidations, ProductMiddleware.validateProduct, ProductValidations.validateUpdateProduct],
    ProductController.updateProductById
);

router.delete(
    '/:id',
    [jwtValidations, ProductMiddleware.validateProduct, ProductValidations.validateDeleteProductById],
    ProductController.deleteProductById
);


module.exports = router;
