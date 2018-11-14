const view = require('../views/tag')
const repo = require('../models/repo/tags')
const input = require('../input-filters/tags')
const error = require('../views/error')

const auth = require('@wdalmut/mini-auth');
const token = require('@wdalmut/token-auth');
const basic = require('@wdalmut/basic-auth');
const one_of = require('@wdalmut/one-of');

const { from_basic, from_token } = require('../auth');
const { if_exists, view_one, view_many } = require('./helpers');

const list = (req, res) => {
  repo
    .list()
    .then(view_many(res))
    .catch(error.generic(res))
}

const get = (req, res) => {
  repo
    .get(req.params.id)
    .then(if_exists)
    .then(view_one(res))
    .catch(error.generic(res))
}

const create = (req, res) => {
  repo
    .create(Object.assign({}, req.body, { project: 'NO PROJECT' }))
    .then(view_one(res))
    .catch(error.generic(res))
}

const patch = (req, res) => {
  repo
    .update(req.params.id, req.body)
    .then(view_one(res))
    .catch(error.generic(res))
}

let tags = require('express').Router()

tags.get('/',
  //auth(one_of([token(from_token), basic(from_basic)])),
  input.validate_tags_input,
  list
);

tags.get('/:id',
  //auth(one_of([token(from_token), basic(from_basic)])),
  input.validate_tag_input,
  get
)

tags.post('/',
  //auth(one_of([token(from_token), basic(from_basic)])),
  input.validate_create_tag_input,
  create
)

tags.patch('/:id',
  //auth(one_of([token(from_token), basic(from_basic)])),
  input.validate_patch_tag_input,
  patch
)

module.exports = tags
