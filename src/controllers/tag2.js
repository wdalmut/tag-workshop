const view = require('../views/tag')
const repo = require('../models/repo/tags')
const input = require('../input-filters/tags')
const error = require('../views/error')

const auth = require('@wdalmut/mini-auth');
const token = require('@wdalmut/token-auth');
const basic = require('@wdalmut/basic-auth');
const one_of = require('@wdalmut/one-of');

const { from_basic, from_token } = require('../auth');
const { if_exists, view_one_v2, view_many_v2 } = require('./helpers');

const list = (req, res) => {
  repo
    .list(req.query)
    .then(view_many_v2(res))
    .catch(error.generic(res))
}

const get = (req, res) => {
  repo
    .get(req.params.id)
    .then(if_exists)
    .then(view_one_v2(res))
    .catch(error.generic(res))
}

const create = (req, res) => {
  repo
    .create(req.body)
    .then(view_one_v2(res))
    .catch(error.generic(res))
}

const patch = (req, res) => {
  repo
    .update(req.params.id, req.body)
    .then(view_one_v2(res))
    .catch(error.generic(res))
}

let tags = require('express').Router()

tags.get('/',
  //auth(one_of([token(from_token), basic(from_basic)])),
  input.validate_tags_v2_input,
  list
);

tags.get('/:id',
  //auth(one_of([token(from_token), basic(from_basic)])),
  input.validate_tag_input,
  get
)

tags.post('/',
  //auth(one_of([token(from_token), basic(from_basic)])),
  input.validate_create_tag_v2_input,
  create
)

tags.patch('/:id',
  //auth(one_of([token(from_token), basic(from_basic)])),
  input.validate_patch_tag_input,
  patch
)

module.exports = tags

