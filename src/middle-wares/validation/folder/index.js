const appRoot = require('app-root-path');
const Folder = require(appRoot + '/src/models/folder');
const _get = require('lodash.get');
const appConstants = require(appRoot + '/src/constants/app-constants');
const { status, messages } = appConstants;

// In this method we will validate booking

exports.validateFolder = async (req, res, next) => {
    try {
        let folderId;
        if (_get(req, 'body._id')) {
            folderId = _get(req, 'body._id')
        }
        if (_get(req, 'params.id')) {
            folderId = _get(req, 'params.id')
        }
        if (_get(req, 'query.id')) {
            folderId = _get(req, 'query.id')
        }
        if (folderId) {
            const folderToFind = await Folder.findById(folderId);
            if (!folderToFind) {
                return res.status(status.notFound).json({
                    message: `Sorry, we couldn't find Folder for the requested ID`
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