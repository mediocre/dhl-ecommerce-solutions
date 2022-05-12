const assert = require('assert');

const cache = require('memory-cache');

const DhlEcommerceSolutions = require('../index');

describe('DhlEcommerceSolutions.getAccessToken', function() {
    this.timeout(5000);

    beforeEach(function() {
        cache.clear();
    });

    it('should return an error for invalid environmentUrl', function(done) {
        const dhlEcommerceSolutions = new DhlEcommerceSolutions({
            environmentUrl: 'invalid'
        });

        dhlEcommerceSolutions.getAccessToken(function(err, accessToken) {
            assert(err);
            assert.strictEqual(err.message, 'Invalid URI "invalid/auth/v4/accesstoken"');
            assert.strictEqual(err.status, undefined);
            assert.strictEqual(accessToken, undefined);

            done();
        });
    });

    it('should return an error for non 200 status code', function(done) {
        const dhlEcommerceSolutions = new DhlEcommerceSolutions({
            client_id: process.env.CLIENT_ID,
            client_secret: process.env.CLIENT_SECRET,
            environmentUrl: 'https://httpbin.org/status/500#'
        });

        dhlEcommerceSolutions.getAccessToken(function(err, accessToken) {
            assert(err);
            assert.strictEqual(err.message, 'Internal Server Error');
            assert.strictEqual(err.status, 500);
            assert.strictEqual(accessToken, undefined);

            done();
        });
    });

    it('should return a valid access token', function(done) {
        const dhlEcommerceSolutions = new DhlEcommerceSolutions({
            client_id: process.env.CLIENT_ID,
            client_secret: process.env.CLIENT_SECRET
        });

        dhlEcommerceSolutions.getAccessToken(function(err, accessToken) {
            assert.ifError(err);

            assert(accessToken);
            assert(accessToken.access_token);
            assert(accessToken.client_id);
            assert(accessToken.expires_in);
            assert.strictEqual(accessToken.token_type, 'Bearer');

            done();
        });
    });

    it('should return the same access token on subsequent calls', function(done) {
        const dhlEcommerceSolutions = new DhlEcommerceSolutions({
            client_id: process.env.CLIENT_ID,
            client_secret: process.env.CLIENT_SECRET
        });

        dhlEcommerceSolutions.getAccessToken(function(err, accessToken1) {
            assert.ifError(err);

            dhlEcommerceSolutions.getAccessToken(function(err, accessToken2) {
                assert.ifError(err);
                assert.deepStrictEqual(accessToken2, accessToken1);
                done();
            });
        });
    });
});