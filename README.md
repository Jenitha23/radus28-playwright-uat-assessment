# Radus28 Playwright UAT Assessment

This project contains Playwright automation tests for the Radus28 CRM application.

## Application

https://playwrightcrm.radus28.com/

## Tech Stack

- Playwright
- JavaScript
- Node.js
- Google Chrome

## Test Coverage

### Login
- Valid username and password
- Invalid username
- Invalid password
- Invalid username and password
- Empty username
- Empty password
- Empty username and password

## Installation

```bash
git clone <YOUR_REPOSITORY_URL>
cd radus28-playwright-uat-assessment
npm install
Run Tests

Run all tests:

npx playwright test

Run only login tests:

npx playwright test tests/login.spec.js

Run with browser visible:

npx playwright test tests/login.spec.js --headed
View Report
npx playwright show-report
Current Result
7 passed

Tests are configured to run sequentially using one worker.