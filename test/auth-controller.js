const { expect, should } = require('chai');
const sinon = require('sinon');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const authController = require('../controllers/auth');
const User = require('../models/user');
const auth = require('../middleware/auth');

describe('Authorization controller', () => {

    afterEach(function() {
        sinon.restore();
    });

    it('Auth: Return 401 status code when logging in with an e-mail that does not exist', (done) => {
        const req = {
            body: {
                email: 'test@test.com',
                password: 'abcd'
            }
        };

        sinon.stub(User, 'findOne').returns(Promise.resolve(null));

        authController.login(req, {}, () => {})
            .then( (result) => {
                expect(result).to.be.an('error');
                expect(result).to.have.property('statusCode', 401);
                done();
            });
    });

    it('Auth: Return 401 status code when logging in with e-mail and password that do not match', (done) => {
        const req = {
            body: {
                email: 'test@test.com',
                password: 'abcd'
            }
        };

        sinon.stub(User, 'findOne').returns(Promise.resolve({
            id: 1,
            email: 'test@test.com',
            password: 'abcd'
        }));

        sinon.stub(bcrypt, 'compare').returns(false);

        authController.login(req, {}, () => {})
            .then( (result) => {
                expect(result).to.be.an('error');
                expect(result).to.have.property('statusCode', 401);
                done();
            });
    });

    it('Auth: Return JSON with user id, token and email when sucessfully loging in', (done) => {
        const req = {
            body: {
                email: 'test@test.com',
                password: 'abcd'
            }
        };

        sinon.stub(User, 'findOne').returns(Promise.resolve({
            id: 1,
            email: 'test@test.com',
            password: 'abcd'
        }));

        sinon.stub(bcrypt, 'compare').returns(Promise.resolve(true));

        res = { send: () => {} };
        authController.login(req, res, () => {})
            .then( (result) => {
                expect(result).to.have.property('id', 1);
                expect(result).to.have.property('email', 'test@test.com');
                expect(result).to.have.property('token');
                done();
            });
    });

});
