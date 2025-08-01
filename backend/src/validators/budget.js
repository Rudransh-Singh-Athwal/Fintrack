const Joi = require("joi");

exports.budgetValidator = Joi.object({
  category: Joi.string().trim().max(100).optional(),
  amount: Joi.number().min(0).required(),
  month: Joi.number().min(1).max(12).required(),
  year: Joi.number().min(2000).max(2100).required(),
});
