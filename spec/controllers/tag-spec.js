const R = require('ramda');
const request = require('supertest');

const mock = require('mock-require');

describe("Tag action", () => {
  beforeEach(db_init);

  // Mock external auth module
  //beforeEach(() => {
    //const tag = {
      //id: 1,
      //name: "test-tag@gmail.com",
    //};
    //mock('../../src/auth', {
      //from_basic: (name, password) => Promise.resolve(tag),
      //from_token: (token) => Promise.resolve(tag),
    //});
  //})

  afterAll(mock.stopAll);

  let app;

  beforeEach((done) => {
    app = require('../..');
    done();
  });

  it("should list tags", (done) => {
    request(app)
      .get('/v1/tag')
      .set('Authorization', 'Bearer test')
      .expect(200)
      .end((err, res) => {
        expect(R.map(R.pick(['name']), res.body)).toEqual([
          {name: "parte 1"},
          {name: "parte 2"}
        ]);
        done();
      })
  })

  it("should get an tag", (done) => {
    request(app)
      .get('/v1/tag/1')
      .set('Authorization', 'Bearer test')
      .expect(200)
      .end((err, res) => {
        expect(R.pick(['name'], res.body)).toEqual({name: "parte 1"});
        done();
      });
  })

  it("should reply with 404 on missing tag", (done) => {
    request(app)
      .get('/v1/tag/571398')
      .set('Authorization', 'Bearer test')
      .expect(404, done)
  })

  it("should create a new tags", (done) => {
    request(app)
      .post('/v1/tag')
      .set('Authorization', 'Bearer test')
      .send({
        name: 'parte askjfhaskj',
      })
      .expect(200)
      .end((err, res) => {
        expect(R.pick(['name'], res.body)).toEqual({name: "parte askjfhaskj"});
        expect(R.not(R.isNil(res.body.created_at))).toBe(true)
        expect(R.isNil(res.body.updated_at)).toBe(true)
        done();
      });
  })

  it("should create a new tags and project must be 'NO PROJECT'", (done) => {
    request(app)
      .post('/v1/tag')
      .set('Authorization', 'Bearer test')
      .send({
        name: 'parte nuova',
      })
      .expect(200)
      .end((err, res) => {
        expect(R.pick(['name'], res.body)).toEqual({name: "parte nuova"});

        const Tag = require('../../src/models/tag');

        return Tag.query().where({id: res.body.id}).first().then((tag) => {
          expect(tag.project).toEqual("NO PROJECT");
          done();
        })
      });
  })


  it("should cannot create a tags with an existing name", (done) => {
    request(app)
      .post('/v1/tag')
      .set('Authorization', 'Bearer test')
      .send({
        name: 'parte 1',
      })
      .expect(409, done)
  })

  it("should update tags information", (done) => {
    request(app)
      .patch('/v1/tag/1')
      .set('Authorization', 'Bearer test')
      .send({
        name: 'hello',
      })
      .expect(200)
      .end((err, res) => {
        expect(R.pick(['name'], res.body)).toEqual({
          name: "hello",
        });
        expect(R.not(R.isNil(res.body.created_at))).toBe(true)
        expect(R.not(R.isNil(res.body.updated_at))).toBe(true)
        done();
      });
  })

  it("should cannot update tags information on existing names", (done) => {
    request(app)
      .patch('/v1/tag/1')
      .set('Authorization', 'Bearer test')
      .send({
        name: 'parte 2',
      })
      .expect(409, done)
  })
});
