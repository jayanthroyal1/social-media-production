const Joi = require("joi");

exports.createPostSchema = Joi.object({
  content: Joi.string().trim().min(1).max(500).optional(),
});

exports.postIdSchema = Joi.object({
  id: Joi.string().length(24).hex().required(),
});

exports.paginationSchema = Joi.object({
  page: Joi.number().integer().min(1).default(1),
  limit: Joi.number().integer().min(1).max(100).default(10),
});
