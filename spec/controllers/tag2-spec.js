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
      .get('/v2/tag')
      .set('Authorization', 'Bearer test')
      .expect(200)
      .end((err, res) => {
        expect(R.map(R.pick(['name', 'project']), res.body)).toEqual([
          {name: "parte 1", project: 'TEST1'},
          {name: "parte 2", project: 'TEST2'}
        ]);
        done();
      })
  })

  it("should list tags with filters", (done) => {
    request(app)
      .get('/v2/tag?project=TEST2')
      .set('Authorization', 'Bearer test')
      .expect(200)
      .end((err, res) => {
        expect(R.map(R.pick(['name', 'project']), res.body)).toEqual([
          {name: "parte 2", project: 'TEST2'}
        ]);
        done();
      })
  })

  it("should get an tag", (done) => {
    request(app)
      .get('/v2/tag/1')
      .set('Authorization', 'Bearer test')
      .expect(200)
      .end((err, res) => {
        expect(R.pick(['name', 'project'], res.body)).toEqual({name: "parte 1", project: 'TEST1'});
        done();
      });
  })

  it("should reply with 404 on missing tag", (done) => {
    request(app)
      .get('/v2/tag/571398')
      .set('Authorization', 'Bearer test')
      .expect(404, done)
  })

  it("should create a new tags", (done) => {
    request(app)
      .post('/v2/tag')
      .set('Authorization', 'Bearer test')
      .send({
        name: 'parte askjfhaskj',
        project: 'Pippo',
      })
      .expect(200)
      .end((err, res) => {
        expect(R.pick(['name', 'project'], res.body)).toEqual({
          name: "parte askjfhaskj",
          project: "Pippo"
        });
        expect(R.not(R.isNil(res.body.created_at))).toBe(true)
        expect(R.isNil(res.body.updated_at)).toBe(true)
        done();
      });
  })

  it("should reply with an error on missing project", (done) => {
    request(app)
      .post('/v2/tag')
      .set('Authorization', 'Bearer test')
      .send({
        name: 'parte nuova',
      })
      .expect(400, done)
  })

  it("should cannot create a tags with an existing name", (done) => {
    request(app)
      .post('/v2/tag')
      .set('Authorization', 'Bearer test')
      .send({
        name: 'parte 1',
        project: "ciao",
      })
      .expect(409, done)
  })

  it("should update tags information", (done) => {
    request(app)
      .patch('/v2/tag/1')
      .set('Authorization', 'Bearer test')
      .send({
        name: 'hello',
      })
      .expect(200)
      .end((err, res) => {
        expect(R.pick(['name', 'project'], res.body)).toEqual({
          name: "hello",
          project: 'TEST1',
        });
        expect(R.not(R.isNil(res.body.created_at))).toBe(true)
        expect(R.not(R.isNil(res.body.updated_at))).toBe(true)
        done();
      });
  })

  it("should cannot update tags information on existing names", (done) => {
    request(app)
      .patch('/v2/tag/1')
      .set('Authorization', 'Bearer test')
      .send({
        name: 'parte 2',
      })
      .expect(409, done)
  })
});

