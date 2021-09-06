const chai = require('chai');
const { expect } = require('chai');
const chaiHttp = require('chai-http');
const sinon = require('sinon');
const bcrypt = require('bcrypt');

const User = require('../models/user');
const app = require('../app');

chai.use(chaiHttp);

describe('Authorization controller - Login', () => {

    afterEach(function() {
        sinon.restore();
    });

    it('Auth: Return 401 status code when logging in with an e-mail that does not exist', (done) => {
        const data = {
            email: 'test@test.com',
            password: 'abcdefgh'
        };

        sinon.stub(User, 'findOne').returns(Promise.resolve(null));

        chai.request(app)
            .post('/auth')
            .send(data)
            .end( (err, res, body) => {
                expect(res).to.have.property('statusCode', 401);
                done();
            });
    });

    it('Auth: Return 401 status code when logging in with e-mail and password that do not match', (done) => {
        const data = {
            email: 'test@test.com',
            password: 'abcdefgh'
        };

        sinon.stub(User, 'findOne').returns(Promise.resolve({
            id: 1,
            email: data.email,
            password: data.password
        }));

        sinon.stub(bcrypt, 'compare').returns(false);

        chai.request(app)
            .post('/auth')
            .send(data)
            .end( (err, res, body) => {
                expect(res).to.have.property('statusCode', 401);
                done();
            });
    });

    it('Auth: Return JSON with user id, token and email when sucessfully loging in', (done) => {
        const data = {
            email: 'test@test.com',
            password: 'abcdefgh'
        };

        sinon.stub(User, 'findOne').returns(Promise.resolve({
            id: 1,
            email: data.email,
            password: data.password
        }));

        sinon.stub(bcrypt, 'compare').returns(Promise.resolve(true));

        chai.request(app)
            .post('/auth')
            .send(data)
            .end( (err, res, body) => {
                expect(res.body).to.have.property('id', 1);
                expect(res.body).to.have.property('email', data.email);
                expect(res.body).to.have.property('token');
                done();
            });
    });

});
