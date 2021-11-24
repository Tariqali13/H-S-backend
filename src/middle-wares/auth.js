const appRoot = require('app-root-path');
const config = require('config');
const jwt = require('jsonwebtoken');
const PUBLIC_API_TOKEN = config.get('auth.public.token');
const appConstants = require(appRoot + '/src/constants/app-constants');

module.exports = (req, res, next) => {
    try {
        const token = req.headers['authorization'];
        const getMethod = req.method == 'GET';
        // check token
        if (!token) {
            return res.status(401).json({
                message: 'No token, Auth Denied!!!',
                statusCode: '401',
                statusDesc: 'You are not authorized to access this protected resource'
            });
        }
        if (token.includes('Public')) {
            if (!getMethod) {
                res.status(400).json({
                    message: 'Token is invalid!',
                    statusCode: '401',
                    statusDesc: 'You are not authorized to access this protected resource'
                });
            }
            let publicToken = token.slice('Public '.length);
            if (publicToken !== PUBLIC_API_TOKEN) {
                res.status(400).json({
                    message: 'Token is invalid!',
                    statusCode: '401',
                    statusDesc: 'You are not authorized to access this protected resource'
                });
            }
        } else {
            const protectedToken = token.slice('Bearer '.length);
            const decode = jwt.verify(protectedToken, appConstants.tokenKey);
            req.user_data = decode;
        }
        next();
    } catch (err) {
        console.log(err);
        return res.status(401).json({
            message: "Auth failed"
        });
    }
};