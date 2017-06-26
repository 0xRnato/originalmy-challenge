process.env.NODE_ENV = 'test';

const should = require('chai').should();
const expect = require('chai').expect;
const supertest = require('supertest');

const {server, db} = require('./../server/server');
const UserController = require('./../server/models/user/user.controller')(db);
const api = supertest(`http://localhost:${process.env.PORT}`);

let token;

describe('User', () => {
    it('Should truncate the test database', (done) => {
        api.get('/api/user/truncate')
            .expect(200, done);
    });

    describe('/GET - load users', () => {
        it('Should return request forbidden', (done) => {
            api.get('/api/user/all')
                .expect(403)
                .end((err, res) => {
                    expect(res.body).to.have.property('success');
                    expect(res.body.success).to.equal(false);
                    done();
                });
        });
    });

    describe('/POST - save user', () => {
        it('Should warn that the username can not be empty or null', (done) => {
            api.post('/api/user/save')
                .set('Content-Type', 'application/json')
                .send({
                    'userData': {
                        'username': null,
                        'password': null,
                    },
                })
                .expect(200)
                .end((err, res) => {
                    expect(res.body).to.have.property('success');
                    expect(res.body.success).to.equal(false);
                    expect(res.body).to.have.property('err');
                    expect(res.body.err).to.equal('Username can not be void or null.');
                    done();
                });
        });

        it('Should warn that the password can not be empty or null', (done) => {
            api.post('/api/user/save')
                .set('Content-Type', 'application/json')
                .send({
                    'userData': {
                        'username': 'renato',
                        'password': null,
                    },
                })
                .expect(200)
                .end((err, res) => {
                    expect(res.body).to.have.property('success');
                    expect(res.body.success).to.equal(false);
                    expect(res.body).to.have.property('err');
                    expect(res.body.err).to.equal('Password can not be void or null.');
                    done();
                });
        });

        it('Should save the user', (done) => {
            api.post('/api/user/save')
                .set('Content-Type', 'application/json')
                .send({
                    'userData': {
                        'username': 'renato',
                        'password': 'root',
                    },
                })
                .expect(200)
                .end((err, res) => {
                    expect(res.body).to.have.property('success');
                    expect(res.body.success).to.equal(true);
                    expect(res.body).to.have.property('data');
                    expect(res.body.data).to.be.an('object');
                    expect(res.body.data).to.have.property('username');
                    expect(res.body.data.username).to.be.equal('renato');
                    expect(res.body.data).to.have.property('password');
                    expect(res.body.data.password).to.be.equal('root');
                    done();
                });
        });

        it('Should not create users with equal usernames', (done) => {
            api.post('/api/user/save')
                .set('Content-Type', 'application/json')
                .send({
                    'userData': {
                        'username': 'renato',
                        'password': 'root',
                    },
                })
                .expect(200)
                .end((err, res) => {
                    expect(res.body).to.have.property('success');
                    expect(res.body.success).to.equal(false);
                    expect(res.body).to.have.property('err');
                    expect(res.body.err).to.be.an('object');
                    expect(res.body.err).to.have.property('code');
                    expect(res.body.err.code).to.be.equal('ER_DUP_ENTRY');
                    done();
                });
        });
    });

    describe('/POST - authenticate user', () => {
        it('Should warn that the username can not be empty or null', (done) => {
            api.post('/api/user/login')
                .set('Content-Type', 'application/json')
                .send({
                    'userData': {
                        'username': null,
                        'password': null,
                    },
                })
                .expect(200)
                .end((err, res) => {
                    expect(res.body).to.have.property('success');
                    expect(res.body.success).to.equal(false);
                    expect(res.body).to.have.property('err');
                    expect(res.body.err).to.equal('Username can not be void or null.');
                    done();
                });
        });

        it('Should warn that the password can not be empty or null', (done) => {
            api.post('/api/user/login')
                .set('Content-Type', 'application/json')
                .send({
                    'userData': {
                        'username': 'renato',
                        'password': null,
                    },
                })
                .expect(200)
                .end((err, res) => {
                    expect(res.body).to.have.property('success');
                    expect(res.body.success).to.equal(false);
                    expect(res.body).to.have.property('err');
                    expect(res.body.err).to.equal('Password can not be void or null.');
                    done();
                });
        });

        it('User should not be found, the username is wrong', (done) => {
            api.post('/api/user/login')
                .set('Content-Type', 'application/json')
                .send({
                    'userData': {
                        'username': 'renatoo',
                        'password': 'roott',
                    },
                })
                .expect(200)
                .end((err, res) => {
                    expect(res.body).to.have.property('success');
                    expect(res.body.success).to.equal(false);
                    expect(res.body).to.have.property('err');
                    expect(res.body.err).to.be.a('string');
                    expect(res.body.err).to.be.equal('Authentication falied. User not found.');
                    done();
                });
        });

        it('User should not be found, the password is wrong', (done) => {
            api.post('/api/user/login')
                .set('Content-Type', 'application/json')
                .send({
                    'userData': {
                        'username': 'renato',
                        'password': 'roott',
                    },
                })
                .expect(200)
                .end((err, res) => {
                    expect(res.body).to.have.property('success');
                    expect(res.body.success).to.equal(false);
                    expect(res.body).to.have.property('err');
                    expect(res.body.err).to.be.a('string');
                    expect(res.body.err).to.be.equal('Authentication falied. Wrong password.');
                    done();
                });
        });

        it('Should authenticate the user', (done) => {
            api.post('/api/user/login')
                .set('Content-Type', 'application/json')
                .send({
                    'userData': {
                        'username': 'renato',
                        'password': 'root',
                    },
                })
                .expect(200)
                .end((err, res) => {
                    expect(res.body).to.have.property('success');
                    expect(res.body.success).to.equal(true);
                    expect(res.body).to.have.property('token');
                    expect(res.body.token).to.be.a('string');
                    token = res.body.token;
                    done();
                });
        });
    });

    describe('/GET - load users with access token', () => {
        it('Should return a list with 1 user', (done) => {
            api.get('/api/user/all')
                .set('x-access-token', token)
                .expect(200)
                .end((err, res) => {
                    expect(res.body).to.have.property('success');
                    expect(res.body.success).to.equal(true);
                    expect(res.body).to.have.property('data');
                    expect(res.body.data).to.be.an('array');
                    expect(res.body.data).to.have.lengthOf(1);
                    expect(res.body.data[0]).to.be.an('object');
                    expect(res.body.data[0]).to.have.property('username');
                    expect(res.body.data[0].username).to.be.equal('renato');
                    done();
                });
        });

        it('The token should expires', (done) => {
            setTimeout(() => {
                api.get('/api/user/all')
                    .set('x-access-token', token)
                    .expect(200)
                    .end((err, res) => {
                        expect(res.body).to.have.property('success');
                        expect(res.body.success).to.equal(false);
                        expect(res.body).to.have.property('err');
                        expect(res.body.err).to.be.a('string');
                        expect(res.body.err).to.be.equal('jwt expired');
                        done();
                    });
            }, 5000);
        });
    });

    describe('/POST - logout and remove the token from db', () => {
        // login again to some tests
         it('Should authenticate the user', (done) => {
            api.post('/api/user/login')
                .set('Content-Type', 'application/json')
                .send({
                    'userData': {
                        'username': 'renato',
                        'password': 'root',
                    },
                })
                .expect(200)
                .end((err, res) => {
                    expect(res.body).to.have.property('success');
                    expect(res.body.success).to.equal(true);
                    expect(res.body).to.have.property('token');
                    expect(res.body.token).to.be.a('string');
                    token = res.body.token;
                    done();
                });
        });

        it('Should warn that the username can not be empty or null', (done) => {
            api.post('/api/user/logout')
                .set('Content-Type', 'application/json')
                .set('x-access-token', token)
                .send({
                    'userData': {
                        'username': null,
                        'password': null,
                    },
                })
                .expect(200)
                .end((err, res) => {
                    expect(res.body).to.have.property('success');
                    expect(res.body.success).to.equal(false);
                    expect(res.body).to.have.property('err');
                    expect(res.body.err).to.equal('Username can not be void or null.');
                    done();
                });
        });

        it('Should warn that the password can not be empty or null', (done) => {
            api.post('/api/user/logout')
                .set('Content-Type', 'application/json')
                .set('x-access-token', token)
                .send({
                    'userData': {
                        'username': 'renato',
                        'password': null,
                    },
                })
                .expect(200)
                .end((err, res) => {
                    expect(res.body).to.have.property('success');
                    expect(res.body.success).to.equal(false);
                    expect(res.body).to.have.property('err');
                    expect(res.body.err).to.equal('Password can not be void or null.');
                    done();
                });
        });

        it('User should not be found, the username is wrong', (done) => {
            api.post('/api/user/logout')
                .set('Content-Type', 'application/json')
                .set('x-access-token', token)
                .send({
                    'userData': {
                        'username': 'renatoo',
                        'password': 'roott',
                    },
                })
                .expect(200)
                .end((err, res) => {
                    expect(res.body).to.have.property('success');
                    expect(res.body.success).to.equal(false);
                    expect(res.body).to.have.property('err');
                    expect(res.body.err).to.be.a('string');
                    expect(res.body.err).to.be.equal('Logout falied, User not Found.');
                    done();
                });
        });

        it('User should not be found, the password is wrong', (done) => {
            api.post('/api/user/logout')
                .set('Content-Type', 'application/json')
                .set('x-access-token', token)
                .send({
                    'userData': {
                        'username': 'renato',
                        'password': 'roott',
                    },
                })
                .expect(200)
                .end((err, res) => {
                    expect(res.body).to.have.property('success');
                    expect(res.body.success).to.equal(false);
                    expect(res.body).to.have.property('err');
                    expect(res.body.err).to.be.a('string');
                    expect(res.body.err).to.be.equal('Logout falied, User not Found.');
                    done();
                });
        });

        it('User should be logged out', (done) => {
            api.post('/api/user/logout')
                .set('Content-Type', 'application/json')
                .set('x-access-token', token)
                .send({
                    'userData': {
                        'username': 'renato',
                        'password': 'root',
                    },
                })
                .expect(200)
                .end((err, res) => {
                    expect(res.body).to.have.property('success');
                    expect(res.body.success).to.equal(true);
                    expect(res.body).to.have.property('data');
                    expect(res.body.data).to.be.an('object');
                    expect(res.body.data).to.have.property('username');
                    expect(res.body.data.username).to.equal('renato');
                    done();
                });
        });
    });
});
