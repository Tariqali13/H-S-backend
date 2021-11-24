const appRoot = require('app-root-path');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const appConstants = require(appRoot + '/src/constants/app-constants');

const auth = module.exports = {
    generateToken: async (tokenPayload) => {
        console.log("tokenPayload", tokenPayload)
        return await jwt.sign(
            tokenPayload,
            appConstants.tokenKey,
            {expiresIn: appConstants.tokenExpire}
        );
    },

    generateHash: async (password) => {
        const saltRounds = 10;
        const salt = await bcrypt.genSalt(saltRounds);
        return await bcrypt.hash(password, salt);
    },
}
