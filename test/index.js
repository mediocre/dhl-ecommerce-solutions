const assert = require('assert');

const cache = require('memory-cache');

const DhlEcommerceSolutions = require('../index');

describe('DhlEcommerceSolutions.findProducts', function() {
    this.timeout(5000);

    beforeEach(function() {
        cache.clear();
    });

    it('should return an error for invalid environmentUrl', function(done) {
        const dhlEcommerceSolutions = new DhlEcommerceSolutions({
            environmentUrl: 'invalid'
        });

        dhlEcommerceSolutions.findProducts({}, function(err, response) {
            assert(err);
            assert.strictEqual(err.message, 'Invalid URI "invalid/auth/v4/accesstoken"');
            assert.strictEqual(err.status, undefined);
            assert.strictEqual(response, undefined);

            done();
        });
    });

    it('should return an error for invalid environmentUrl', function(done) {
        var dhlEcommerceSolutions = new DhlEcommerceSolutions({
            client_id: process.env.CLIENT_ID,
            client_secret: process.env.CLIENT_SECRET
        });

        dhlEcommerceSolutions.getAccessToken(function(err, accessToken) {
            assert.ifError(err);

            dhlEcommerceSolutions = new DhlEcommerceSolutions({
                environmentUrl: 'invalid'
            });

            // Update cache
            cache.put('invalid/auth/v4/accesstoken?client_id=undefined', accessToken, accessToken.expires_in * 1000 / 2);

            dhlEcommerceSolutions.findProducts({}, function(err, response) {
                assert(err);
                assert.strictEqual(err.message, 'Invalid URI "invalid/shipping/v4/products"');
                assert.strictEqual(err.status, undefined);
                assert.strictEqual(response, undefined);

                done();
            });
        });
    });

    it('should return an error for non 200 status code', function(done) {
        var dhlEcommerceSolutions = new DhlEcommerceSolutions({
            client_id: process.env.CLIENT_ID,
            client_secret: process.env.CLIENT_SECRET
        });

        dhlEcommerceSolutions.getAccessToken(function(err) {
            assert.ifError(err);

            dhlEcommerceSolutions = new DhlEcommerceSolutions({
                environmentUrl: 'https://httpbin.org/status/500#'
            });

            dhlEcommerceSolutions.findProducts({}, function(err, response) {
                assert(err);
                assert.strictEqual(err.message, 'Internal Server Error');
                assert.strictEqual(err.status, 500);
                assert.strictEqual(response, undefined);

                done();
            });
        });
    });

    it('should return an error when no body is specified', function(done) {
        const dhlEcommerceSolutions = new DhlEcommerceSolutions({
            client_id: process.env.CLIENT_ID,
            client_secret: process.env.CLIENT_SECRET
        });

        dhlEcommerceSolutions.findProducts({}, function(err, response) {
            assert(err);
            assert.strictEqual(err.status, 400);
            assert.strictEqual(response, undefined);

            done();
        });
    });

    it('should return a valid response', function(done) {
        const dhlEcommerceSolutions = new DhlEcommerceSolutions({
            client_id: process.env.CLIENT_ID,
            client_secret: process.env.CLIENT_SECRET
        });

        const _request = {
            consigneeAddress: {
                address1: '114 Whitney Ave',
                city: 'New Haven',
                country: 'US',
                name: 'John Doe',
                postalCode: '06510',
                state: 'CT'
            },
            distributionCenter: 'USDFW1',
            packageDetail: {
                packageDescription: 'ORDER NO 20483739DFDR',
                packageId: 'GM60511234500000001',
                weight: {
                    unitOfMeasure: 'LB',
                    value: 3
                }
            },
            pickup: '5351244',
            rate: {
                calculate: true,
                currency: 'USD'
            },
            returnAddress: {
                address1: '4717 Plano Parkway',
                address2: 'Suite 130',
                city: 'Carrollton',
                companyName: 'Mercatalyst',
                country: 'US',
                postalCode: '75010',
                state: 'TX'
            }
        };

        dhlEcommerceSolutions.findProducts(_request, function(err, response) {
            assert.ifError(err);
            assert(response.products.length);
            assert(response.products.some(product => product.rate.amount));

            done();
        });
    });
});

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