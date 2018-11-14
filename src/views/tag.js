const R = require('ramda')

const fields = ['id', 'name', 'created_at', 'updated_at']
const fields_v2 = ['id', 'name', 'project', 'created_at', 'updated_at']

module.exports = {
  one: (tag) => {
    return R.pick(fields, tag)
  },
  one_v2: (tag) => {
    return R.pick(fields_v2, tag)
  },
  many: (tags) => {
    return R.map(R.pick(fields))(tags)
  },
  many_v2: (tags) => {
    return R.map(R.pick(fields_v2))(tags)
  }
}
