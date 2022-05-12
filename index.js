const cache = require('memory-cache');
const createError = require('http-errors');
const request = require('request');

function DhlEcommerceSolutions(args) {
    const options = Object.assign({
        client_id: '',
        client_secret: '',
        environmentUrl: 'https://api-sandbox.dhlecs.com'
    }, args);

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

        request.post(req, function(err, res, body) {
            if (err) {
                return callback(err);
            }

            if (res.statusCode !== 200) {
                return callback(createError(res.statusCode));
            }

            // Put the access token in memory cache
            cache.put(key, body, body.expires_in * 1000 / 2);

            callback(null, body);
        });
    };
}

module.exports = DhlEcommerceSolutions;