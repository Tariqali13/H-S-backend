const appRoot = require('app-root-path');
const Joi = require('joi');
const appConstants = require(appRoot + '/src/constants/app-constants');
const { status, messages } = appConstants;

const validateReposition = async (req, res, next) => {
  try {
    const schema = Joi.object().keys({
      desired_location: Joi.string().required(),
      direction: Joi.string().required(),
      videoId: Joi.string().required(),
      other_folder: Joi.boolean().optional(),
      other_folder_id: Joi.string().optional(),
      folder_id: Joi.string().optional(),
    })
    await schema.validateAsync(req.body);
    next();
  } catch (error) {
    return res.status(status.validationError).json({message: error["details"][0]["message"]})
  }
};

module.exports = {
  validateReposition,
}