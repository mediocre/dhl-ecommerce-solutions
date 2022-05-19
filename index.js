const cache = require('memory-cache');
const createError = require('http-errors');
const request = require('request');

function DhlEcommerceSolutions(args) {
    const options = Object.assign({
        environment_url: 'https://api-sandbox.dhlecs.com'
    }, args);

    this.applyDimensionalWeight = function(_rateRequest, dim = 166) {
        let _dimension = _rateRequest?.packageDetail?.dimension;
        let _weight = _rateRequest?.packageDetail?.weight;

        if (!_dimension?.height || !_dimension?.length || !_dimension?.width || !_dimension?.unitOfMeasure || !_weight?.value) {
            return;
        }

        const packageVolume = _dimension.length * _dimension.width * _dimension.height;

        // Only consider dimensional weight if the request package's volume is greater than one cubic foot (1,728 cubic inches, 28,316.8 cubic cm)
        if (packageVolume > (_dimension.unitOfMeasure === 'IN' ? 1728 : 28316.8)) {
            let heavierWeight = Math.max(_weight.value, (packageVolume / dim));
            _weight.value = parseFloat(heavierWeight.toFixed(2));
        }
    };

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
                url: `${options.environment_url}/shipping/v4/label?format=${_options.format}`
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
     * Manifest specific open packages (recommended): Only packages specified in the request are added to a request id and only those items will be manifested.
     * Manifest all open items: The last 20,000 labels generated for the given pickup location are added to a request id and will be manifested.
     */
    this.createManifest = function(_request, callback) {
        this.getAccessToken(function(err, accessToken) {
            if (err) {
                return callback(err);
            }

            const req = {
                auth: {
                    bearer: accessToken.access_token
                },
                json: _request,
                url: `${options.environment_url}/shipping/v4/manifest`
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
     * The Dowload Manifest API is used to retrieve and download the manifests that were created using the Create Manifest API.
     * @param {string} pickup DHL eCommerce pickup account number. You will receive this after doing the onboarding with DHL sales
     * @param {string} requestId DHL eCommerce manifest request ID that was provided in the POST manifest response object
     */
    this.downloadManifest = function(pickup, requestId, callback) {
        this.getAccessToken(function(err, accessToken) {
            if (err) {
                return callback(err);
            }

            const req = {
                auth: {
                    bearer: accessToken.access_token
                },
                json: true,
                url: `${options.environment_url}/shipping/v4/manifest/${pickup}/${requestId}`
            };

            request.get(req, function(err, res, response) {
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
                url: `${options.environment_url}/shipping/v4/products`
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
        const url = `${options.environment_url}/auth/v4/accesstoken`;
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
     * Track using a single packageId.
     */
    this.getTrackingByPackageId = function(packageId, callback) {
        this.getAccessToken(function(err, accessToken) {
            if (err) {
                return callback(err);
            }

            const req = {
                auth: {
                    bearer: accessToken.access_token
                },
                json: true,
                url: `${options.environment_url}/tracking/v4/package?packageId=${packageId}`
            };

            request.get(req, function(err, res, response) {
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