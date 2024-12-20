const assert = require('assert');
const crypto = require('crypto');

const cache = require('memory-cache');

const DhlEcommerceSolutions = require('../index');

describe('DhlEcommerceSolutions.applyDimensionalWeight', function() {
    this.timeout(5000);

    let _request = {};

    beforeEach(function() {
        _request = {
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
                dimension: {
                    height: 14,
                    length: 14,
                    width: 14,
                    unitOfMeasure: 'IN'
                },
                packageDescription: 'ORDER NO 20483739DFDR',
                packageId: 'GM60511234500000001',
                weight: {
                    unitOfMeasure: 'LB',
                    value: 5
                }
            },
            pickup: '5351244',
            rate: {
                calculate: true,
                currency: 'USD'
            },
            returnAddress: {
                address1: '1950 Parker Road',
                address2: 'Receiving Door 32',
                city: 'Carrollton',
                companyName: 'Mercatalyst',
                country: 'US',
                postalCode: '75010',
                state: 'TX'
            }
        };
    });

    describe('should not set request weight equal to dimensional weight', function() {
        it('should not set request weight equal to dimensional weight when request does not contain a weight unit of measure', function(done) {
            const dhlEcommerceSolutions = new DhlEcommerceSolutions({});

            delete _request.packageDetail.weight.unitOfMeasure;

            dhlEcommerceSolutions.applyDimensionalWeight(_request);

            assert.strictEqual('GM60511234500000001', _request.packageDetail.packageId);
            assert.strictEqual(14, _request.packageDetail.dimension.height);
            assert.strictEqual(14, _request.packageDetail.dimension.length);
            assert.strictEqual(14, _request.packageDetail.dimension.width);
            assert.strictEqual('IN', _request.packageDetail.dimension.unitOfMeasure);
            assert.strictEqual(5, _request.packageDetail.weight.value);
            assert.strictEqual(undefined, _request.packageDetail.weight.unitOfMeasure);

            done();
        });

        it('should not set request weight equal to dimensional weight when request unitOfMeasure is not LB, OZ, KG or G', function(done) {
            const dhlEcommerceSolutions = new DhlEcommerceSolutions({});

            _request.packageDetail.weight.unitOfMeasure = 'T';

            dhlEcommerceSolutions.applyDimensionalWeight(_request);

            assert.strictEqual('GM60511234500000001', _request.packageDetail.packageId);
            assert.strictEqual(14, _request.packageDetail.dimension.height);
            assert.strictEqual(14, _request.packageDetail.dimension.length);
            assert.strictEqual(14, _request.packageDetail.dimension.width);
            assert.strictEqual('IN', _request.packageDetail.dimension.unitOfMeasure);
            assert.strictEqual(5, _request.packageDetail.weight.value);
            assert.strictEqual('T', _request.packageDetail.weight.unitOfMeasure);

            done();
        });

        it('should not set request weight equal to dimensional weight when request does not contain a weight value', function(done) {
            const dhlEcommerceSolutions = new DhlEcommerceSolutions({});

            delete _request.packageDetail.weight.value;

            dhlEcommerceSolutions.applyDimensionalWeight(_request);

            assert.strictEqual('GM60511234500000001', _request.packageDetail.packageId);
            assert.strictEqual(14, _request.packageDetail.dimension.height);
            assert.strictEqual(14, _request.packageDetail.dimension.length);
            assert.strictEqual(14, _request.packageDetail.dimension.width);
            assert.strictEqual('IN', _request.packageDetail.dimension.unitOfMeasure);
            assert.strictEqual(undefined, _request.packageDetail.weight.value);
            assert.strictEqual('LB', _request.packageDetail.weight.unitOfMeasure);

            done();
        });

        it('should not set request weight equal to dimensional weight when request weight is less than 1lb', function(done) {
            const dhlEcommerceSolutions = new DhlEcommerceSolutions({});

            _request.packageDetail.weight.value = .5;

            dhlEcommerceSolutions.applyDimensionalWeight(_request);

            assert.strictEqual('GM60511234500000001', _request.packageDetail.packageId);
            assert.strictEqual(14, _request.packageDetail.dimension.height);
            assert.strictEqual(14, _request.packageDetail.dimension.length);
            assert.strictEqual(14, _request.packageDetail.dimension.width);
            assert.strictEqual('IN', _request.packageDetail.dimension.unitOfMeasure);
            assert.strictEqual(.5, _request.packageDetail.weight.value);
            assert.strictEqual('LB', _request.packageDetail.weight.unitOfMeasure);

            done();
        });

        it('should not set request weight equal to dimensional weight when request does not contain a height', function(done) {
            const dhlEcommerceSolutions = new DhlEcommerceSolutions({});

            delete _request.packageDetail.dimension.height;

            dhlEcommerceSolutions.applyDimensionalWeight(_request);

            assert.strictEqual('GM60511234500000001', _request.packageDetail.packageId);
            assert.strictEqual(undefined, _request.packageDetail.dimension.height);
            assert.strictEqual(14, _request.packageDetail.dimension.length);
            assert.strictEqual(14, _request.packageDetail.dimension.width);
            assert.strictEqual('IN', _request.packageDetail.dimension.unitOfMeasure);
            assert.strictEqual(5, _request.packageDetail.weight.value);
            assert.strictEqual('LB', _request.packageDetail.weight.unitOfMeasure);

            done();
        });

        it('should not set request weight equal to dimensional weight when request does not contain a dimension unit of measure', function(done) {
            const dhlEcommerceSolutions = new DhlEcommerceSolutions({});

            delete _request.packageDetail.dimension.unitOfMeasure;

            dhlEcommerceSolutions.applyDimensionalWeight(_request);

            assert.strictEqual('GM60511234500000001', _request.packageDetail.packageId);
            assert.strictEqual(14, _request.packageDetail.dimension.height);
            assert.strictEqual(14, _request.packageDetail.dimension.length);
            assert.strictEqual(14, _request.packageDetail.dimension.width);
            assert.strictEqual(undefined, _request.packageDetail.dimension.unitOfMeasure);
            assert.strictEqual(5, _request.packageDetail.weight.value);
            assert.strictEqual('LB', _request.packageDetail.weight.unitOfMeasure);

            done();
        });

        it('should not set request weight equal to dimensional weight when request length + girth is less than 50 inches', function(done) {
            const dhlEcommerceSolutions = new DhlEcommerceSolutions({});

            _request.packageDetail.dimension.height = 5;
            _request.packageDetail.dimension.length = 5;
            _request.packageDetail.dimension.width = 5;

            dhlEcommerceSolutions.applyDimensionalWeight(_request);

            assert.strictEqual('GM60511234500000001', _request.packageDetail.packageId);
            assert.strictEqual(5, _request.packageDetail.dimension.height);
            assert.strictEqual(5, _request.packageDetail.dimension.length);
            assert.strictEqual(5, _request.packageDetail.dimension.width);
            assert.strictEqual('IN', _request.packageDetail.dimension.unitOfMeasure);
            assert.strictEqual(5, _request.packageDetail.weight.value);
            assert.strictEqual('LB', _request.packageDetail.weight.unitOfMeasure);

            done();
        });

        it('should not set request weight equal to dimensional weight when request volume (in) is less than 1 cubic foot', function(done) {
            const dhlEcommerceSolutions = new DhlEcommerceSolutions({});

            _request.packageDetail.dimension.height = 1;
            _request.packageDetail.dimension.length = 1;
            _request.packageDetail.dimension.width = 25;

            dhlEcommerceSolutions.applyDimensionalWeight(_request);

            assert.strictEqual('GM60511234500000001', _request.packageDetail.packageId);
            assert.strictEqual(1, _request.packageDetail.dimension.height);
            assert.strictEqual(1, _request.packageDetail.dimension.length);
            assert.strictEqual(25, _request.packageDetail.dimension.width);
            assert.strictEqual('IN', _request.packageDetail.dimension.unitOfMeasure);
            assert.strictEqual(5, _request.packageDetail.weight.value);
            assert.strictEqual('LB', _request.packageDetail.weight.unitOfMeasure);

            done();
        });

        it('should not set request weight equal to dimensional weight when request volume (cm) is less than 1 cubic foot', function(done) {
            const dhlEcommerceSolutions = new DhlEcommerceSolutions({});

            _request.packageDetail.dimension.height = 3;
            _request.packageDetail.dimension.length = 3;
            _request.packageDetail.dimension.width = 64;
            _request.packageDetail.dimension.unitOfMeasure = 'CM';

            dhlEcommerceSolutions.applyDimensionalWeight(_request);

            assert.strictEqual('GM60511234500000001', _request.packageDetail.packageId);
            assert.strictEqual(3, _request.packageDetail.dimension.height);
            assert.strictEqual(3, _request.packageDetail.dimension.length);
            assert.strictEqual(64, _request.packageDetail.dimension.width);
            assert.strictEqual('CM', _request.packageDetail.dimension.unitOfMeasure);
            assert.strictEqual(5, _request.packageDetail.weight.value);
            assert.strictEqual('LB', _request.packageDetail.weight.unitOfMeasure);

            done();
        });

        it('should not set request weight equal to dimensional weight when weight is larger than dimensional weight', function(done) {
            const dhlEcommerceSolutions = new DhlEcommerceSolutions({});

            _request.packageDetail.weight.value = 50;

            dhlEcommerceSolutions.applyDimensionalWeight(_request);

            assert.strictEqual('GM60511234500000001', _request.packageDetail.packageId);
            assert.strictEqual(14, _request.packageDetail.dimension.height);
            assert.strictEqual(14, _request.packageDetail.dimension.length);
            assert.strictEqual(14, _request.packageDetail.dimension.width);
            assert.strictEqual('IN', _request.packageDetail.dimension.unitOfMeasure);
            assert.strictEqual(50, _request.packageDetail.weight.value);
            assert.strictEqual('LB', _request.packageDetail.weight.unitOfMeasure);

            done();
        });

        it('should not set request weight equal to dimensional weight when weight is larger than dimensional weight (kg)', function(done) {
            const dhlEcommerceSolutions = new DhlEcommerceSolutions({});

            _request.packageDetail.weight.value = 50;
            _request.packageDetail.weight.unitOfMeasure = 'KG';

            dhlEcommerceSolutions.applyDimensionalWeight(_request);

            assert.strictEqual('GM60511234500000001', _request.packageDetail.packageId);
            assert.strictEqual(14, _request.packageDetail.dimension.height);
            assert.strictEqual(14, _request.packageDetail.dimension.length);
            assert.strictEqual(14, _request.packageDetail.dimension.width);
            assert.strictEqual('IN', _request.packageDetail.dimension.unitOfMeasure);
            assert.strictEqual(110.25, _request.packageDetail.weight.value);
            assert.strictEqual('LB', _request.packageDetail.weight.unitOfMeasure);

            done();
        });
    });

    describe('should set request weight equal to dimensional weight', function() {
        it('should set dimensional weight when request unit of mesaure is inches', function(done) {
            const dhlEcommerceSolutions = new DhlEcommerceSolutions({});

            dhlEcommerceSolutions.applyDimensionalWeight(_request);

            assert.strictEqual('GM60511234500000001', _request.packageDetail.packageId);
            assert.strictEqual(14, _request.packageDetail.dimension.height);
            assert.strictEqual(14, _request.packageDetail.dimension.length);
            assert.strictEqual(14, _request.packageDetail.dimension.width);
            assert.strictEqual('IN', _request.packageDetail.dimension.unitOfMeasure);
            assert.strictEqual(16.53, _request.packageDetail.weight.value);
            assert.strictEqual('LB', _request.packageDetail.weight.unitOfMeasure);

            done();
        });

        it('should set dimensional weight when request unit of mesaure is cm', function(done) {
            const dhlEcommerceSolutions = new DhlEcommerceSolutions({});

            _request.packageDetail.dimension.height = 40;
            _request.packageDetail.dimension.length = 40;
            _request.packageDetail.dimension.width = 40;
            _request.packageDetail.dimension.unitOfMeasure = 'CM';

            dhlEcommerceSolutions.applyDimensionalWeight(_request);

            assert.strictEqual('GM60511234500000001', _request.packageDetail.packageId);
            assert.strictEqual(40, _request.packageDetail.dimension.height);
            assert.strictEqual(40, _request.packageDetail.dimension.length);
            assert.strictEqual(40, _request.packageDetail.dimension.width);
            assert.strictEqual('CM', _request.packageDetail.dimension.unitOfMeasure);
            assert.strictEqual(23.53, _request.packageDetail.weight.value);
            assert.strictEqual('LB', _request.packageDetail.weight.unitOfMeasure);

            done();
        });

        it('should set dimensional weight when request weight is in LB', function(done) {
            const dhlEcommerceSolutions = new DhlEcommerceSolutions({});

            _request.packageDetail.weight.unitOfMeasure = 'LB';
            _request.packageDetail.weight.value = 12;

            dhlEcommerceSolutions.applyDimensionalWeight(_request);

            assert.strictEqual('GM60511234500000001', _request.packageDetail.packageId);
            assert.strictEqual(14, _request.packageDetail.dimension.height);
            assert.strictEqual(14, _request.packageDetail.dimension.length);
            assert.strictEqual(14, _request.packageDetail.dimension.width);
            assert.strictEqual('IN', _request.packageDetail.dimension.unitOfMeasure);
            assert.strictEqual(16.53, _request.packageDetail.weight.value);
            assert.strictEqual('LB', _request.packageDetail.weight.unitOfMeasure);

            done();
        });

        it('should set dimensional weight when request weight is in OZ', function(done) {
            const dhlEcommerceSolutions = new DhlEcommerceSolutions({});

            _request.packageDetail.weight.unitOfMeasure = 'OZ';
            _request.packageDetail.weight.value = 100;

            dhlEcommerceSolutions.applyDimensionalWeight(_request);

            assert.strictEqual('GM60511234500000001', _request.packageDetail.packageId);
            assert.strictEqual(14, _request.packageDetail.dimension.height);
            assert.strictEqual(14, _request.packageDetail.dimension.length);
            assert.strictEqual(14, _request.packageDetail.dimension.width);
            assert.strictEqual('IN', _request.packageDetail.dimension.unitOfMeasure);
            assert.strictEqual(16.53, _request.packageDetail.weight.value);
            assert.strictEqual('LB', _request.packageDetail.weight.unitOfMeasure);

            done();
        });

        it('should set dimensional weight when request weight is in KG', function(done) {
            const dhlEcommerceSolutions = new DhlEcommerceSolutions({});

            _request.packageDetail.weight.unitOfMeasure = 'KG';
            _request.packageDetail.weight.value = 10;

            dhlEcommerceSolutions.applyDimensionalWeight(_request);

            assert.strictEqual('GM60511234500000001', _request.packageDetail.packageId);
            assert.strictEqual(14, _request.packageDetail.dimension.height);
            assert.strictEqual(14, _request.packageDetail.dimension.length);
            assert.strictEqual(14, _request.packageDetail.dimension.width);
            assert.strictEqual('IN', _request.packageDetail.dimension.unitOfMeasure);
            assert.strictEqual(22.05, _request.packageDetail.weight.value);
            assert.strictEqual('LB', _request.packageDetail.weight.unitOfMeasure);

            done();
        });

        it('should set dimensional weight when request weight is in G', function(done) {
            const dhlEcommerceSolutions = new DhlEcommerceSolutions({});

            _request.packageDetail.weight.unitOfMeasure = 'G';
            _request.packageDetail.weight.value = 2500;

            dhlEcommerceSolutions.applyDimensionalWeight(_request);

            assert.strictEqual('GM60511234500000001', _request.packageDetail.packageId);
            assert.strictEqual(14, _request.packageDetail.dimension.height);
            assert.strictEqual(14, _request.packageDetail.dimension.length);
            assert.strictEqual(14, _request.packageDetail.dimension.width);
            assert.strictEqual('IN', _request.packageDetail.dimension.unitOfMeasure);
            assert.strictEqual(16.53, _request.packageDetail.weight.value);
            assert.strictEqual('LB', _request.packageDetail.weight.unitOfMeasure);

            done();
        });

        it('should allow dimensional divisor to be changed', function(done) {
            const dhlEcommerceSolutions = new DhlEcommerceSolutions({});

            dhlEcommerceSolutions.applyDimensionalWeight(_request, '200');

            assert.strictEqual('GM60511234500000001', _request.packageDetail.packageId);
            assert.strictEqual(14, _request.packageDetail.dimension.height);
            assert.strictEqual(14, _request.packageDetail.dimension.length);
            assert.strictEqual(14, _request.packageDetail.dimension.width);
            assert.strictEqual('IN', _request.packageDetail.dimension.unitOfMeasure);
            assert.strictEqual(13.72, _request.packageDetail.weight.value);
            assert.strictEqual('LB', _request.packageDetail.weight.unitOfMeasure);

            done();
        });
    });
});

describe('DhlEcommerceSolutions.createLabel', function() {
    this.timeout(5000);

    beforeEach(function() {
        cache.clear();
    });

    it('should return an error for invalid environment_url', function(done) {
        const dhlEcommerceSolutions = new DhlEcommerceSolutions({
            environment_url: 'invalid'
        });

        dhlEcommerceSolutions.createLabel({}, function(err, response) {
            assert(err);
            assert.strictEqual(err.message, 'Invalid URI "invalid/auth/v4/accesstoken"');
            assert.strictEqual(err.status, undefined);
            assert.strictEqual(response, undefined);

            done();
        });
    });

    it('should return an error for invalid environment_url', function(done) {
        var dhlEcommerceSolutions = new DhlEcommerceSolutions({
            client_id: process.env.CLIENT_ID,
            client_secret: process.env.CLIENT_SECRET
        });

        dhlEcommerceSolutions.getAccessToken(function(err, accessToken) {
            assert.ifError(err);

            dhlEcommerceSolutions = new DhlEcommerceSolutions({
                environment_url: 'invalid'
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
                environment_url: 'https://httpbin.org/status/500#'
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
                address1: '1950 Parker Road',
                address2: 'Receiving Door 32',
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
                address1: '1950 Parker Road',
                address2: 'Receiving Door 32',
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

describe('DhlEcommerceSolutions.createManifest', function() {
    this.timeout(30000);

    beforeEach(function() {
        cache.clear();
    });

    it('should return an error for invalid environment_url', function(done) {
        const dhlEcommerceSolutions = new DhlEcommerceSolutions({
            environment_url: 'invalid'
        });

        dhlEcommerceSolutions.createManifest({ manifests: [], pickup: '1234567' }, function(err, response) {
            assert(err);
            assert.strictEqual(err.message, 'Invalid URI "invalid/auth/v4/accesstoken"');
            assert.strictEqual(err.status, undefined);
            assert.strictEqual(response, undefined);

            done();
        });
    });

    it('should return an error for invalid environment_url', function(done) {
        var dhlEcommerceSolutions = new DhlEcommerceSolutions({
            client_id: process.env.CLIENT_ID,
            client_secret: process.env.CLIENT_SECRET
        });

        dhlEcommerceSolutions.getAccessToken(function(err, accessToken) {
            assert.ifError(err);

            dhlEcommerceSolutions = new DhlEcommerceSolutions({
                environment_url: 'invalid'
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
                environment_url: 'https://httpbin.org/status/500#'
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

describe('DhlEcommerceSolutions.downloadManifest', function() {
    this.timeout(30000);

    beforeEach(function() {
        cache.clear();
    });

    it('should return an error for invalid environment_url', function(done) {
        const dhlEcommerceSolutions = new DhlEcommerceSolutions({
            environment_url: 'invalid'
        });

        dhlEcommerceSolutions.downloadManifest('5351244', 'b56fe9d0-1111-2222-a11f-f8f8635f985a', function(err, response) {
            assert(err);
            assert.strictEqual(err.message, 'Invalid URI "invalid/auth/v4/accesstoken"');
            assert.strictEqual(err.status, undefined);
            assert.strictEqual(response, undefined);

            done();
        });
    });

    it('should return an error for invalid environment_url', function(done) {
        var dhlEcommerceSolutions = new DhlEcommerceSolutions({
            client_id: process.env.CLIENT_ID,
            client_secret: process.env.CLIENT_SECRET
        });

        dhlEcommerceSolutions.getAccessToken(function(err, accessToken) {
            assert.ifError(err);

            // Update cache
            cache.put('invalid/auth/v4/accesstoken?client_id=undefined', accessToken, accessToken.expires_in * 1000 / 2);

            dhlEcommerceSolutions = new DhlEcommerceSolutions({
                environment_url: 'invalid'
            });

            dhlEcommerceSolutions.downloadManifest('5351244', 'b56fe9d0-1111-2222-a11f-f8f8635f985a', function(err, response) {
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
                environment_url: 'https://httpbin.org/status/500#'
            });

            dhlEcommerceSolutions.downloadManifest('5351244', 'b56fe9d0-1111-2222-a11f-f8f8635f985a', function(err, response) {
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

        const pickup = '5351244';

        dhlEcommerceSolutions.createManifest({ manifests: [], pickup }, function(err, response) {
            assert.ifError(err);
            assert.ok(response.requestId);

            const requestId = response.requestId;

            dhlEcommerceSolutions.downloadManifest(pickup, requestId, function(err, response) {
                assert.ifError(err);
                assert.ifError(response.errorCode);
                assert.ifError(response.errorDescription);

                assert.ok(response.manifestSummary);
                assert(Number.isInteger(response.manifestSummary.total));
                assert.strictEqual(pickup, response.pickup);
                assert.strictEqual(requestId, response.requestId);
                assert.strictEqual(['CREATED', 'IN_PROGRESS', 'COMPLETED'].includes(response.status), true);
                assert.notStrictEqual(NaN, Date.parse(response.timestamp));

                done();
            });
        });
    });
});

describe('DhlEcommerceSolutions.findProducts', function() {
    this.timeout(5000);

    beforeEach(function() {
        cache.clear();
    });

    it('should return an error for invalid environment_url', function(done) {
        const dhlEcommerceSolutions = new DhlEcommerceSolutions({
            environment_url: 'invalid'
        });

        dhlEcommerceSolutions.findProducts({}, function(err, response) {
            assert(err);
            assert.strictEqual(err.message, 'Invalid URI "invalid/auth/v4/accesstoken"');
            assert.strictEqual(err.status, undefined);
            assert.strictEqual(response, undefined);

            done();
        });
    });

    it('should return an error for invalid environment_url', function(done) {
        var dhlEcommerceSolutions = new DhlEcommerceSolutions({
            client_id: process.env.CLIENT_ID,
            client_secret: process.env.CLIENT_SECRET
        });

        dhlEcommerceSolutions.getAccessToken(function(err, accessToken) {
            assert.ifError(err);

            dhlEcommerceSolutions = new DhlEcommerceSolutions({
                environment_url: 'invalid'
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
                environment_url: 'https://httpbin.org/status/500#'
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
                address1: '1950 Parker Road',
                address2: 'Receiving Door 32',
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

    it('should return an error for invalid environment_url', function(done) {
        const dhlEcommerceSolutions = new DhlEcommerceSolutions({
            environment_url: 'invalid'
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
            environment_url: 'https://httpbin.org/status/500#'
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

    it('should return an error for invalid environment_url', function(done) {
        const dhlEcommerceSolutions = new DhlEcommerceSolutions({
            environment_url: 'invalid'
        });

        dhlEcommerceSolutions.getTrackingByPackageId('V4-TEST-1586965592482', function(err, response) {
            assert(err);
            assert.strictEqual(err.message, 'Invalid URI "invalid/auth/v4/accesstoken"');
            assert.strictEqual(err.status, undefined);
            assert.strictEqual(response, undefined);

            done();
        });
    });

    it('should return an error for invalid environment_url', function(done) {
        var dhlEcommerceSolutions = new DhlEcommerceSolutions({
            client_id: process.env.CLIENT_ID,
            client_secret: process.env.CLIENT_SECRET
        });

        dhlEcommerceSolutions.getAccessToken(function(err, accessToken) {
            assert.ifError(err);

            dhlEcommerceSolutions = new DhlEcommerceSolutions({
                environment_url: 'invalid'
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
                environment_url: 'https://httpbin.org/status/500#'
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

    it.skip('should return a response', function(done) {
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

describe('DhlEcommerceSolutions.getTrackingByTrackingId', function() {
    this.timeout(5000);

    beforeEach(function() {
        cache.clear();
    });

    it('should return an error for invalid environment_url', function(done) {
        const dhlEcommerceSolutions = new DhlEcommerceSolutions({
            environment_url: 'invalid'
        });

        dhlEcommerceSolutions.getTrackingByTrackingId('9374869903500011991299', function(err, response) {
            assert(err);
            assert.strictEqual(err.message, 'Invalid URI "invalid/auth/v4/accesstoken"');
            assert.strictEqual(err.status, undefined);
            assert.strictEqual(response, undefined);

            done();
        });
    });

    it('should return an error for invalid environment_url', function(done) {
        var dhlEcommerceSolutions = new DhlEcommerceSolutions({
            client_id: process.env.CLIENT_ID,
            client_secret: process.env.CLIENT_SECRET
        });

        dhlEcommerceSolutions.getAccessToken(function(err, accessToken) {
            assert.ifError(err);

            dhlEcommerceSolutions = new DhlEcommerceSolutions({
                environment_url: 'invalid'
            });

            // Update cache
            cache.put('invalid/auth/v4/accesstoken?client_id=undefined', accessToken, accessToken.expires_in * 1000 / 2);

            dhlEcommerceSolutions.getTrackingByTrackingId('9374869903500011991299', function(err, response) {
                assert(err);
                assert.strictEqual(err.message, 'Invalid URI "invalid/tracking/v4/package?trackingId=9374869903500011991299"');
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
                environment_url: 'https://httpbin.org/status/500#'
            });

            dhlEcommerceSolutions.getTrackingByTrackingId('9374869903500011991299', function(err, response) {
                assert(err);
                assert.strictEqual(err.message, 'Internal Server Error');
                assert.strictEqual(err.status, 500);
                assert.strictEqual(response, undefined);

                done();
            });
        });
    });

    it.skip('should return a response', function(done) {
        const dhlEcommerceSolutions = new DhlEcommerceSolutions({
            client_id: process.env.CLIENT_ID,
            client_secret: process.env.CLIENT_SECRET
        });

        dhlEcommerceSolutions.getTrackingByTrackingId('9374869903500011991299', function(err, response) {
            assert.ifError(err);
            assert.strictEqual(response.packages.length, 0);

            done();
        });
    });
});