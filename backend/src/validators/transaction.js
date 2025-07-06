const Joi = require('joi');

exports.transactionValidator = Joi.object({
    amount: Joi.number().required(),
    date: Joi.date().required(),
    description: Joi.string().trim().empty('').default("Miscellaneous").optional()
});