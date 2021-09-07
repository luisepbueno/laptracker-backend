const expect = require('chai').expect;
const sinon = require('sinon');
const jwt = require('jsonwebtoken');

const authMiddleware = require('../middleware/auth');

describe('Authorization middleware', () => {

    afterEach(() => {
        sinon.restore();
    });

    it('Auth: Throw error when there is not authorization header', () => {
        const req = {
            get: () => {
                return undefined;
            }
        };
        expect(authMiddleware.bind(this, req, {})).to.throw('User not logged.');
    });

    it('Auth: Throw error when authorization header is an empty string', () => {
        const req = {
            get: () => {
                return '';
            }
        };
        expect(authMiddleware.bind(this, req, {})).to.throw();
    });

    it('Auth: Throw error when authorization header is in the wrong format - single string', () => {
        const req = {
            get: () => {
                return 'Bearer';
            }
        };
        expect(authMiddleware.bind(this, req, {})).to.throw();
    });

    it('Auth: Throw error when authorization header is in the wrong format - invalid jwt', () => {
        const req = {
            get: () => {
                return 'Bearer afds423';
            }
        };
        expect(authMiddleware.bind(this, req, {})).to.throw();
    });

    it('Auth: userId must be in the request when authentication succeeds', () => {
        const req = {
            get: () => {
                return 'Bearer afds423';
            }
        };
        sinon.stub(jwt, 'verify').returns({id: 1});
        authMiddleware(req, {}, () => {});
        expect(req).to.have.property('userId', 1);
    });
});
