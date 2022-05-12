# dhl-ecommerce-solutions

[![Build Status](https://github.com/mediocre/dhl-ecommerce-solutions/workflows/build/badge.svg?branch=main)](https://github.com/mediocre/dhl-ecommerce-solutions/actions?query=workflow%3Abuild+branch%3Amain)
[![Coverage Status](https://coveralls.io/repos/github/mediocre/dhl-ecommerce-solutions/badge.svg?branch=main)](https://coveralls.io/github/mediocre/dhl-ecommerce-solutions?branch=main)

The DHL ECOMMERCE SOLUTIONS AMERICAS API is your one stop solution to get shipping products, calculating duty and tax, generating shipping labels, manifesting packages, requesting shipment pickup, tracking packages and generating return labels.

https://docs.api.dhlecs.com

## Usage

```javascript
const DhlEcommerceSolutions = require('dhl-ecommerce-solutions');

const dhlEcommerceSolutions = new DhlEcommerceSolutions({
    client_id: 'your_api_key',
    client_secret: 'your_api_secret',
    environmentUrl: 'https://api-sandbox.dhlecs.com'
});
```

### dhlEcommerceSolutions.getAccessToken(callback)

To access any of DHL eCommerce's API resources, client credentials (clientId and clientSecret) are required which must be exchanged for an access token.

https://docs.api.dhlecs.com/#9dc55deb-9f2b-4ee5-af36-40d102beafaa

**Example**

```javascript
dhlEcommerceSolutions.getAccessToken(function(err, accessToken) {
    console.log(accessToken);
});
```