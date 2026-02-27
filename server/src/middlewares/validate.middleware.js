// src/middlewares/validate.middleware.js
const { sendError } = require("../utils/apiResponse");

/**
 * Joi validation middleware factory.
 * @param {import("joi").ObjectSchema} schema - Joi schema to validate against
 * @param {"body"|"query"|"params"} target - Request part to validate
 */
const validate = (schema, target = "body") => (req, res, next) => {
    const { error, value } = schema.validate(req[target], {
        abortEarly: false,
        stripUnknown: true,
    });

    if (error) {
        const errors = error.details.map((d) => d.message.replace(/['"]/g, ""));
        return sendError(res, { statusCode: 422, message: "Validation failed", errors });
    }

    req[target] = value; // replace with sanitised value
    next();
};

module.exports = { validate };
