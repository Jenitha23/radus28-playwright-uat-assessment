# Radus28 Playwright UAT Assessment

Playwright automation suite for the Radus28 CRM application, covering the
Login and Lead Creation scenarios from the assessment brief.

## Application under test
https://playwrightcrm.radus28.com/

Login credentials are provided in the assessment email and are hardcoded in
the spec files for this exercise .

## Tech stack
- Playwright (`@playwright/test`)
- JavaScript
- Node.js
- Google Chrome

## Quick start
```bash
git clone <YOUR_REPOSITORY_URL>
cd radus28-playwright-uat-assessment
npm install
npx playwright install chrome

npx playwright test              # run everything
npx playwright test --headed     # watch it run
npx playwright show-report       # view the HTML report
```

## Project structure
```
tests/
  login.spec.js         # Login scenario
  leadCreation.spec.js  # Lead Creation scenario
playwright.config.js
```

## Test coverage

### Login (`tests/login.spec.js`)
| Case | Scenario |
|---|---|
| TC01 | Valid username and password → dashboard loads |
| TC02 | Invalid username |
| TC03 | Invalid password |
| TC04 | Invalid username and password |
| TC05 | Empty username |
| TC06 | Empty password |
| TC07 | Empty username and password |

### Lead Creation (`tests/leadCreation.spec.js`)
| Case | Scenario |
|---|---|
| TC01 | Last Name left empty → mandatory validation triggers |
| TC02 | Entire form submitted empty → mandatory validation triggers |
| TC03 | All fields completed → lead created, detail page displays |
| TC04 | Only the mandatory Last Name provided → lead created, detail page displays |
| TC05 | Last Name containing only spaces → treated as empty, rejected |

TC01–TC03 of each spec map directly to the two scenarios in the assessment
brief; the remaining cases are additional negative/edge coverage.
