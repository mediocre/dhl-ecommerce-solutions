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

### dhlEcommerceSolutions.createLabel(request, options, callback)

The Label endpoint can generate a US Domestic or an International label.

https://docs.api.dhlecs.com/?version=latest#be69c425-2003-4632-8da1-0303642087d0

**Example**

```javascript
const request = {
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

dhlEcommerceSolutions.createLabel(request, { format: 'PNG' }, function(err, response) {
    console.log(response);
});
```

### dhlEcommerceSolutions.findProducts(request, callback)

DHL eCommerce Americas Product Finder API enables clients to determine which DHL shipping products are suitable for a given shipping request including associated rates and estimated delivery dates (EDD).

https://docs.api.dhlecs.com/?version=latest#280c984f-1548-42b4-8a85-cb4c0b2f4126

**Example**

```javascript
const request = {
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

dhlEcommerceSolutions.findProducts(request, function(err, response) {
    console.log(response);
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