const chai = require('chai');
const { expect } = require('chai');
const chaiHttp = require('chai-http');
const sinon = require('sinon');

const User = require('../models/user');
const app = require('../app');

chai.use(chaiHttp);

describe('Authorization controller - Signup', () => {

    afterEach(async function() {
        await User.destroy({where: {email: 'test@test.com'}});
        sinon.restore();
    });

    it('Auth: Return 422 status code when signing up with an e-mail that is already registered', (done) => {
        data = {
            email: 'test@test.com',
            password: 'abcdefgh'
        };

        sinon.stub(User, 'findOne').returns(Promise.resolve({
            id: 1,
            email: data.email,
            password: data.password
        }));

        chai.request(app)
            .post('/auth/signup')
            .send(data)
            .end( (err, res, body) => {
                expect(res).to.have.property('statusCode', 422);
                done();
            });
    });

    it('Auth: Return 422 status code when signing up with an invalid e-mail', (done) => {
        const data = {
            email: 'invalidemail',
            password: 'abcdefgh'
        };

        chai.request(app)
            .post('/auth/signup')
            .send(data)
            .end( (err, res, body) => {
                expect(res).to.have.property('statusCode', 422);
                done();
            });
    });

    it('Auth: Return 422 status code when signing up with a password with lass than 8 characters', (done) => {
        const data = {
            email: 'test@test.com',
            password: 'abcd'
        };

        chai.request(app)
            .post('/auth/signup')
            .send(data)
            .end( (err, res, body) => {
                expect(res).to.have.property('statusCode', 422);
                done();
            });
    });

    it('Auth: Return JSON with user id after successful signup', (done) => {
        const data = {
            email: 'test@test.com',
            password: 'abcdefgh'
        };

        chai.request(app)
            .post('/auth/signup')
            .send(data)
            .end( (err, res, body) => {
                expect(res.body).to.have.property('userId');
                done();
            });
    });

});
