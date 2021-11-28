const appRoot = require('app-root-path');
const Product = require(appRoot + '/src/models/product');
const appConstants = require(appRoot + '/src/constants/app-constants');
const StorageFile = require(appRoot + '/src/models/storage-file');
const { status, messages } = appConstants;
const ProductUtil = require('./util');

exports.getProductById = async (req, res) => {
    try {
        const { id } = req.params;
        const product = await Product.findById(id).populate('created_by').populate("image_id");
        return res.status(status.success).json({
            message: 'Product found Successfully.',
            data: product,
        });
    } catch (err) {
        return res.status(status.serverError).json({
            message: messages.serverErrorMessage
        });
    }
}

exports.getAllProducts = async (req, res) => {
    try {
        const { records_per_page = 0, page_no = 1} = req.query;
        const query = await ProductUtil.buildQuery(req.query)
        const skipPage = parseInt(page_no) - 1;
        const limitPage = parseInt(records_per_page);
        const skipDocuments = skipPage * limitPage;
        const products = await Product.find(query).populate('created_by').populate("image_id").limit(Number(records_per_page)).skip(skipDocuments).sort({ createdAt: -1 });
        const totalNumberOfProducts = await Product.countDocuments(query)
        return res.status(status.success).json({
            message: 'Products found Successfully.',
            data: products,
            page_no: page_no,
            records_per_page: records_per_page,
            total_number_of_products: totalNumberOfProducts,
        });
    } catch (err) {
        console.log(err);
        return res.status(status.serverError).json({
            message: messages.serverErrorMessage
        });
    }
}

exports.createProduct = async (req, res) => {
    try {
        const product = await Product.create(req.body);
        return res.status(status.success).json({
            message: 'Product Created Successfully.',
            data: product,
        });
    } catch (err) {
        console.log("err", err)
        return res.status(status.serverError).json({
            message: messages.serverErrorMessage
        });
    }
}

exports.updateProductById = async (req, res) => {
    try {
        const { id } = req.params;
        const product = await Product.findByIdAndUpdate({ _id: id }, req.body, {new: true});
        return res.status(status.success).json({
            message: 'Product Updated Successfully.',
            data: product,
        });
    } catch (err) {
        return res.status(status.serverError).json({
            message: messages.serverErrorMessage
        });
    }
}

exports.deleteProductById = async (req, res) => {
    try {
        const { id } = req.params;
        const findProduct = await Product.findById(id);
        await StorageFile.findByIdAndUpdate({ _id: findProduct.image_id }, { schedule_to_delete: true, is_deleted: true }, { new: true });
        await Product.deleteOne({ _id: id });
        return res.status(status.success).json({
            message: 'Product deleted Successfully.',
        });
    } catch (err) {
        console.log(err);
        return res.status(status.serverError).json({
            message: messages.serverErrorMessage
        });
    }
}