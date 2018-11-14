const Joi = require('joi')
const validator = require('express-joi-validation')({})

exports.validate_tag_input = validator.query({
})

exports.validate_tags_input = validator.query({
  limit: Joi.number().integer().min(1).max(25).default(1),
  offset: Joi.number().integer().min(0).max(25).default(1),
  name: Joi.string().min(1).max(25).default(null)
})

exports.validate_tags_v2_input = validator.query({
  limit: Joi.number().integer().min(1).max(25).default(1),
  offset: Joi.number().integer().min(0).max(25).default(1),
  name: Joi.string().min(1).max(25),
  project: Joi.string().min(1),
})

exports.validate_create_tag_input = validator.body({
  name: Joi.string().min(1).required()
})

exports.validate_create_tag_v2_input = validator.body({
  name: Joi.string().min(1).required(),
  project: Joi.string().min(1).required(),
})

exports.validate_patch_tag_input = validator.body({
  name: Joi.string().min(1).required()
})

exports.validate_patch_tag_v2_input = validator.body({
  name: Joi.string().min(1),
})

exports.validate_me_input = validator.query({})
