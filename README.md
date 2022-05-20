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
    environment_url: 'https://api-sandbox.dhlecs.com'
});
```

### dhlEcommerceSolutions.applyDimensionalWeight(request, [divisor])

Applies dimensional weight (instead of physical weight) to a rate request if the specified weight and dimensions qualify for dimensional weight.

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

dhlEcommerceSolutions.applyDimensionalWeight(request);
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

### dhlEcommerceSolutions.createManifest(request, callback)

Use the Manifest API to submit a request for closing out / manifesting packages and generate a Driver's Summary Manifest (DSM).

https://docs.api.dhlecs.com/?version=latest#1818efe9-256d-4981-bd66-2f5e76f0cb22

**Example**

```javascript
const request = {
    manifests: [
        {
            dhlPackageIds: [
                '6102010400001402',
                '6102010400001403'
            ]
        }
    ],
    pickup: '5351244'
};

dhlEcommerceSolutions.createManifest(request, function(err, response) {
    console.log(response);
});
```

### dhlEcommerceSolutions.downloadManifest(pickup, requestId, callback)

For Manifest requests that were created using the Create Manifest API, the Download Manifest API is used to retrieve and download the manifests.

https://docs.api.dhlecs.com/?version=latest#ed99b453-b760-4a54-9fb9-7fa1fcac63ee

**Example**

```javascript
dhlEcommerceSolutions.downloadManifest('5351244', 'b56fe9d0-9bce-4d62-a11f-f8f8635f985a', function(err, response) {
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

### dhlEcommerceSolutions.getTrackingByPackageId(packageId, callback)

This API is used to check the latest tracking status of any domestic or international package.

https://docs.api.dhlecs.com/?version=latest#bc8f6e5c-1bb2-45b9-8731-2a7feb5c71c7

**Example**

```javascript
dhlEcommerceSolutions.getTrackingByPackageId('V4-TEST-1586965592482', function(err, response) {
    console.log(response);
});
```