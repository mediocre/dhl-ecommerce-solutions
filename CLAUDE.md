# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a Node.js SDK for the DHL eCommerce Solutions Americas API. It provides a JavaScript interface for shipping operations including label generation, manifest creation, package tracking, and rate calculation.

## Development Commands

### Testing
- `npm test` - Run all tests using Mocha
- `npm run coveralls` - Run tests with code coverage (for CI/CD)
- To run a single test file: `npx mocha test/index.js`
- To run tests matching a pattern: `npx mocha --grep "pattern" test`

### Linting
- `npx eslint .` - Run ESLint on the entire codebase
- ESLint configuration uses the new flat config format (eslint.config.js)

## Architecture

### Core Module Structure
The SDK follows a single-class pattern where all API methods are exposed through the `DhlEcommerceSolutions` class (index.js:5-336).

### Key Components:

1. **Authentication** (index.js:226-267)
   - OAuth2 client credentials flow
   - Access tokens are cached in memory using `memory-cache` module
   - Tokens auto-refresh at half their expiry time

2. **API Methods** - All methods follow callback pattern:
   - `getAccessToken()` - Handles OAuth authentication
   - `createLabel()` - Generate shipping labels (ZPL or PNG format)
   - `createManifest()` - Close out packages for pickup
   - `downloadManifest()` - Retrieve generated manifests
   - `findProducts()` - Get available shipping products with rates
   - `getTrackingByPackageId()` / `getTrackingByTrackingId()` - Track packages
   - `applyDimensionalWeight()` - Calculate dimensional weight for rate requests

3. **Error Handling**
   - Uses `http-errors` module for consistent error objects
   - All API errors include response body in `err.response`

### Dependencies
- `request` - HTTP client (legacy, consider migration to axios/fetch)
- `memory-cache` - In-memory caching for access tokens
- `http-errors` - HTTP error creation

### Testing
- Mocha test framework with built-in assertions
- Tests located in test/index.js
- Coverage reporting via Coveralls in CI/CD

## API Configuration

The SDK requires:
- `client_id` - DHL API client ID
- `client_secret` - DHL API client secret  
- `environment_url` - API endpoint (defaults to sandbox: https://api-sandbox.dhlecs.com)

Production URL: https://api.dhlecs.com

## CI/CD

GitHub Actions workflow (.github/workflows/test.yml):
- Runs on push, PR, and manual dispatch
- Node.js 22.17.0
- Executes linting, testing, and coverage reporting
- Sends Slack notifications for build status