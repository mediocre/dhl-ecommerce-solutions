const cache = require('memory-cache');
const createError = require('http-errors');
const request = require('request');

function DhlEcommerceSolutions(args) {
    const options = Object.assign({
        environmentUrl: 'https://api-sandbox.dhlecs.com'
    }, args);

    /**
     * The Label endpoint can generate a US Domestic or an International label.
     */
     this.createLabel = function(_request, _options, callback) {
        // Options are optional
        if (typeof _options === 'function') {
            callback = _options;
            _options = {};
        }

        // Default format is ZPL
        if (!_options.format) {
            _options.format = 'ZPL';
        }

        this.getAccessToken(function(err, accessToken) {
            if (err) {
                return callback(err);
            }

            const req = {
                auth: {
                    bearer: accessToken.access_token
                },
                json: _request,
                url: `${options.environmentUrl}/shipping/v4/label?format=${_options.format}`
            };

            request.post(req, function(err, res, response) {
                if (err) {
                    return callback(err);
                }

                if (res.statusCode !== 200) {
                    const err = createError(res.statusCode);
                    err.response = response;

                    return callback(err);
                }

                callback(null, response);
            });
        });
    };

    /**
     * To access any of DHL eCommerce's API resources, client credentials (clientId and clientSecret) are required which must be exchanged for an access token.
     */
    this.getAccessToken = function(callback) {
        const url = `${options.environmentUrl}/auth/v4/accesstoken`;
        const key = `${url}?client_id=${options.client_id}`;

        // Try to get the access token from memory cache
        const accessToken = cache.get(key);

        if (accessToken) {
            return callback(null, accessToken);
        }

        const req = {
            form: {
                client_id: options.client_id,
                client_secret: options.client_secret,
                grant_type: 'client_credentials'
            },
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            json: true,
            url
        };

        request.post(req, function(err, res, response) {
            if (err) {
                return callback(err);
            }

            if (res.statusCode !== 200) {
                const err = createError(res.statusCode);
                err.response = response;

                return callback(err);
            }

            // Put the access token in memory cache
            cache.put(key, response, response.expires_in * 1000 / 2);

            callback(null, response);
        });
    };

    /**
     * DHL eCommerce Americas Product Finder API enables clients to determine which DHL shipping products are suitable for a given shipping request including associated rates and estimated delivery dates.
     */
    this.findProducts = function(_request, callback) {
        this.getAccessToken(function(err, accessToken) {
            if (err) {
                return callback(err);
            }

            const req = {
                auth: {
                    bearer: accessToken.access_token
                },
                json: _request,
                url: `${options.environmentUrl}/shipping/v4/products`
            };

            request.post(req, function(err, res, response) {
                if (err) {
                    return callback(err);
                }

                if (res.statusCode !== 200) {
                    const err = createError(res.statusCode);
                    err.response = response;

                    return callback(err);
                }

                callback(null, response);
            });
        });
    };
}

module.exports = DhlEcommerceSolutions;