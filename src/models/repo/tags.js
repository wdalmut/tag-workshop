const { assoc, ifElse, isNil, bind, omit, keys } = require('ramda');

const resolve = bind(Promise.resolve, Promise)
const reject = bind(Promise.reject, Promise)
const reject_because_already_exists = (tag) => reject({status: 409, message: 'Already exists'})

const Tag = require('../tag');

module.exports = {
  list: (params = {}) => {
    let query = Tag.query();

    let filters = omit(['limit', 'offset'], params)
    query.where(filters);

    return query;
  },
  get: (id) => {
    return Tag.query().where({id}).first();
  },
  create: (body) => {
    return Tag.query().where({name: body.name}).first()
      .then(ifElse(isNil, resolve, reject_because_already_exists))
      .then(() => Tag.query().insert(assoc('created_at', new Date(), body)))
      .then((tag) => Tag.query().where({id: tag.id}).first())
    ;
  },
  update: (id, content) => {
    content = assoc('updated_at', new Date(), content);

    return Tag.query().where({ name: content.name }).whereNot({ id }).first()
      .then(ifElse(isNil, resolve, reject_because_already_exists))
      .then(() => Tag.query().where({ id: id }).patch(content))
      .then(() => Tag.query().where({id}).first())
    ;
  },
};
