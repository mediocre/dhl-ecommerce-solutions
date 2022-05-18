const assert = require('assert');
const crypto = require('crypto');

const cache = require('memory-cache');

const DhlEcommerceSolutions = require('../index');

describe('DhlEcommerceSolutions.createLabel', function() {
    this.timeout(5000);

    beforeEach(function() {
        cache.clear();
    });

    it('should return an error for invalid environmentUrl', function(done) {
        const dhlEcommerceSolutions = new DhlEcommerceSolutions({
            environmentUrl: 'invalid'
        });

        dhlEcommerceSolutions.createLabel({}, function(err, response) {
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

            dhlEcommerceSolutions.createLabel({}, function(err, response) {
                assert(err);
                assert.strictEqual(err.message, 'Invalid URI "invalid/shipping/v4/label?format=ZPL"');
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

            dhlEcommerceSolutions.createLabel({}, function(err, response) {
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

        dhlEcommerceSolutions.createLabel({}, function(err, response) {
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
            orderedProductId: 'GND',
            packageDetail: {
                packageDescription: 'ORDER NO 20483739DFDR',
                packageId: crypto.randomUUID().substring(0, 30),
                weight: {
                    unitOfMeasure: 'LB',
                    value: 3
                }
            },
            pickup: '5351244',
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

        dhlEcommerceSolutions.createLabel(_request, function(err, response) {
            assert.ifError(err);
            assert(response);
            assert(response.labels.every(label => label.labelData));
            assert(response.labels.every(label => label.format === 'ZPL'));

            done();
        });
    });

    it('should return a valid response for PNG format', function(done) {
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
            orderedProductId: 'GND',
            packageDetail: {
                packageDescription: 'ORDER NO 20483739DFDR',
                packageId: crypto.randomUUID().substring(0, 30),
                weight: {
                    unitOfMeasure: 'LB',
                    value: 3
                }
            },
            pickup: '5351244',
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

        dhlEcommerceSolutions.createLabel(_request, { format: 'PNG' }, function(err, response) {
            assert.ifError(err);
            assert(response);
            assert(response.labels.every(label => label.labelData));
            assert(response.labels.every(label => label.format === 'PNG'));

            done();
        });
    });
});

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

describe('DhlEcommerceSolutions.getTrackingByPackageId', function() {
    this.timeout(5000);

    beforeEach(function() {
        cache.clear();
    });

    it('should return an error for invalid environmentUrl', function(done) {
        const dhlEcommerceSolutions = new DhlEcommerceSolutions({
            environmentUrl: 'invalid'
        });

        dhlEcommerceSolutions.getTrackingByPackageId('V4-TEST-1586965592482', function(err, response) {
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

            dhlEcommerceSolutions.getTrackingByPackageId('V4-TEST-1586965592482', function(err, response) {
                assert(err);
                assert.strictEqual(err.message, 'Invalid URI "invalid/tracking/v4/package?packageId=V4-TEST-1586965592482"');
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

        dhlEcommerceSolutions.getAccessToken(function(err, accessToken) {
            assert.ifError(err);

            // Update cache
            cache.put('https://httpbin.org/status/500#/auth/v4/accesstoken?client_id=undefined', accessToken, accessToken.expires_in * 1000 / 2);

            dhlEcommerceSolutions = new DhlEcommerceSolutions({
                environmentUrl: 'https://httpbin.org/status/500#'
            });

            dhlEcommerceSolutions.getTrackingByPackageId('V4-TEST-1586965592482', function(err, response) {
                assert(err);
                assert.strictEqual(err.message, 'Internal Server Error');
                assert.strictEqual(err.status, 500);
                assert.strictEqual(response, undefined);

                done();
            });
        });
    });

    it('should return a response', function(done) {
        const dhlEcommerceSolutions = new DhlEcommerceSolutions({
            client_id: process.env.CLIENT_ID,
            client_secret: process.env.CLIENT_SECRET
        });

        dhlEcommerceSolutions.getTrackingByPackageId('V4-TEST-1586965592482', function(err, response) {
            assert.ifError(err);
            assert.strictEqual(response.packages.length, 0);

            done();
        });
    });
});

describe('DhlEcommerceSolutions.createManifest', function() {
    this.timeout(30000);

    beforeEach(function() {
        cache.clear();
    });

    it('should return an error for invalid environmentUrl', function(done) {
        const dhlEcommerceSolutions = new DhlEcommerceSolutions({
            environmentUrl: 'invalid'
        });

        dhlEcommerceSolutions.createManifest({ manifests: [], pickup: '1234567' }, function(err, response) {
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

            dhlEcommerceSolutions.createManifest({ manifests: [], pickup: '5351244' }, function(err, response) {
                assert(err);
                assert.strictEqual(err.message, 'Invalid URI "invalid/shipping/v4/manifest"');
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

        dhlEcommerceSolutions.getAccessToken(function(err, accessToken) {
            assert.ifError(err);

            // Update cache
            cache.put('https://httpbin.org/status/500#/auth/v4/accesstoken?client_id=undefined', accessToken, accessToken.expires_in * 1000 / 2);

            dhlEcommerceSolutions = new DhlEcommerceSolutions({
                environmentUrl: 'https://httpbin.org/status/500#'
            });

            dhlEcommerceSolutions.createManifest({ manifests: [], pickup: '5351244' }, function(err, response) {
                assert(err);
                assert.strictEqual(err.message, 'Internal Server Error');
                assert.strictEqual(err.status, 500);
                assert.strictEqual(response, undefined);

                done();
            });
        });
    });

    it('should return a response', function(done) {
        const dhlEcommerceSolutions = new DhlEcommerceSolutions({
            client_id: process.env.CLIENT_ID,
            client_secret: process.env.CLIENT_SECRET
        });

        dhlEcommerceSolutions.createManifest({ manifests: [], pickup: '5351244' }, function(err, response) {
            assert.ifError(err);

            assert.ok(response.timestamp);
            assert.notStrictEqual(NaN, Date.parse(response.timestamp));
            assert.ok(response.requestId);
            assert.ok(response.link);

            done();
        });
    });
});


describe('DhlEcommerceSolutions.createManifest', function() {
    this.timeout(30000);

    beforeEach(function() {
        cache.clear();
    });

    it('should return an error for invalid environmentUrl', function(done) {
        const dhlEcommerceSolutions = new DhlEcommerceSolutions({
            environmentUrl: 'invalid'
        });

        dhlEcommerceSolutions.downloadManifest({ pickup: '5351244', requestId: 'b56fe9d0-1111-2222-a11f-f8f8635f985a' }, function(err, response) {
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

            // Update cache
            cache.put('invalid/auth/v4/accesstoken?client_id=undefined', accessToken, accessToken.expires_in * 1000 / 2);

            dhlEcommerceSolutions = new DhlEcommerceSolutions({
                environmentUrl: 'invalid'
            });

            dhlEcommerceSolutions.downloadManifest({ pickup: '5351244', requestId: 'b56fe9d0-1111-2222-a11f-f8f8635f985a' }, function(err, response) {
                assert(err);
                assert.strictEqual(err.message, 'Invalid URI "invalid/shipping/v4/manifest/5351244/b56fe9d0-1111-2222-a11f-f8f8635f985a"');
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

        dhlEcommerceSolutions.getAccessToken(function(err, accessToken) {
            assert.ifError(err);

            // Update cache
            cache.put('https://httpbin.org/status/500#/auth/v4/accesstoken?client_id=undefined', accessToken, accessToken.expires_in * 1000 / 2);

            dhlEcommerceSolutions = new DhlEcommerceSolutions({
                environmentUrl: 'https://httpbin.org/status/500#'
            });

            dhlEcommerceSolutions.downloadManifest({ pickup: '5351244', requestId: 'b56fe9d0-1111-2222-a11f-f8f8635f985a' }, function(err, response) {
                assert(err);
                assert.strictEqual(err.message, 'Internal Server Error');
                assert.strictEqual(err.status, 500);
                assert.strictEqual(response, undefined);

                done();
            });
        });
    });

    it('should return a response', function(done) {
        const dhlEcommerceSolutions = new DhlEcommerceSolutions({
            client_id: process.env.CLIENT_ID,
            client_secret: process.env.CLIENT_SECRET
        });

        const accountNumber = '5351244';

        dhlEcommerceSolutions.createManifest({ manifests: [], pickup: accountNumber }, function(err, response) {
            assert.ifError(err);
            assert.ok(response.requestId);

            const manifestRequestId = response.requestId;

            dhlEcommerceSolutions.downloadManifest({ pickup: accountNumber, requestId: manifestRequestId }, function(err, response) {
                assert.ifError(err);
                assert.ifError(response.errorCode);
                assert.ifError(response.errorDescription);

                assert.ok(response.manifestSummary);
                assert(Number.isInteger(response.manifestSummary.total));
                assert.strictEqual(accountNumber, response.pickup);
                assert.strictEqual(manifestRequestId, response.requestId);
                assert.strictEqual('COMPLETED', response.status);
                assert.notStrictEqual(NaN, Date.parse(response.timestamp));

                done();
            });
        });
    });
});