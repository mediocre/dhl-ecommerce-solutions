const cache = require('memory-cache');
const createError = require('http-errors');
const request = require('request');

function DhlEcommerceSolutions(args) {
    const options = Object.assign({
        environment_url: 'https://api-sandbox.dhlecs.com'
    }, args);

    /**
     * Applies dimensional weight (instead of physical weight) to a rate request if the specified weight and dimensions qualify for dimensional weight.
     */
    this.applyDimensionalWeight = function(rateRequest, divisor = 166) {
        let weight = rateRequest?.packageDetail?.weight?.value;

        // Convert weight to LB
        switch (rateRequest?.packageDetail?.weight?.unitOfMeasure) {
            case 'G':
                weight /= 453.592;
                break;
            case 'KG':
                weight *= 2.205;
                break;
            case 'LB':
                break;
            case 'OZ':
                weight /= 16;
                break;
            default:
                return;
        }

        // Don't use dimensional weight if the physical weight is less than or equal to 1 pound
        if (!weight || weight <= 1) {
            return;
        }

        if (!rateRequest?.packageDetail?.dimension?.height || !rateRequest?.packageDetail?.dimension?.length || !rateRequest?.packageDetail?.dimension?.width || !rateRequest?.packageDetail?.dimension?.unitOfMeasure) {
            return;
        }

        let height = rateRequest.packageDetail.dimension.height;
        let length = rateRequest.packageDetail.dimension.length;
        let width = rateRequest.packageDetail.dimension.width;

        // Convert dimensions to inches
        if (rateRequest.packageDetail.dimension.unitOfMeasure === 'CM') {
            height /= 2.54;
            length /= 2.54;
            width /= 2.54;
        }

        // Calculate girth: https://www.dhl.com/us-en/home/ecommerce-solutions/shipping-services.html
        const girth = (2 * width) + (2 * height);

        // Don't use dimensional weight if the length + girth is less than or equal to 50 inches
        if (length + girth <= 50) {
            return;
        }

        const volume = length * width * height;

        // Don't use dimensional weight if the volume is less than or equal to one cubic foot
        if (volume <= 1728) {
            return;
        }

        // Use dimensional weight (if it's larger than physical weight)
        rateRequest.packageDetail.weight.value = Number(Math.max(weight, (volume / divisor)).toFixed(2));
        rateRequest.packageDetail.weight.unitOfMeasure = 'LB';
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

    /**
     * Track using a single trackingId.
     */
    this.getTrackingByTrackingId = function(trackingId, callback) {
        this.getAccessToken(function(err, accessToken) {
            if (err) {
                return callback(err);
            }

            const req = {
                auth: {
                    bearer: accessToken.access_token
                },
                json: true,
                url: `${options.environment_url}/tracking/v4/package?trackingId=${trackingId}`
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