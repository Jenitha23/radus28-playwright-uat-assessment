import { test, expect } from '@playwright/test';

const BASE_URL = 'https://playwrightcrm.radus28.com/';

const VALID_USERNAME = 'playwright';
const VALID_PASSWORD = 'PLaaaY@rite.76';

// Reusable login function
async function login(page, username, password) {
  await page.goto(BASE_URL);

  // Exact locators for the visible login form
  await page.locator('#username').fill(username);
  await page.locator('#password').fill(password);

  await page.getByRole('button', { name: 'Sign in' }).click();
}

test.describe('Radus28 CRM Login Tests', () => {

  // ------------------------------------------------------
  // TC01 - Positive Test
  // ------------------------------------------------------

  test('TC01 - Login successfully with valid credentials', async ({ page }) => {

    await login(
      page,
      VALID_USERNAME,
      VALID_PASSWORD
    );

    // `waitForLoadState('networkidle')` timed out on a live run — this app
    // has persistent background network activity after login (polling/
    // analytics, most likely) that never lets the network go fully idle,
    // so 'networkidle' is not a reliable signal here. `domcontentloaded`
    // fires quickly per the failure logs; the real gate is the login form
    // actually disappearing, asserted below with a generous timeout to
    // absorb any SPA render delay.
    await page.waitForLoadState('domcontentloaded');

    // Login form should disappear after successful login
    await expect(page.locator('#username')).not.toBeVisible({ timeout: 15000 });

    // Dashboard should load successfully — this is the expected outcome
    // stated in the brief, not just "the login form is gone". Based on
    // the accessibility snapshot captured during this assessment, the
    // post-login view renders a "Dashboard" heading; verify this against
    // the live app if it doesn't hold (this line was not confirmed on an
    // authenticated run).
    await expect(
      page.getByRole('heading', { name: 'Dashboard' })
    ).toBeVisible();

    console.log('TC01 PASSED - Login successful');
    console.log('Current URL:', page.url());
  });


  // ------------------------------------------------------
  // TC02 - Invalid Username
  // ------------------------------------------------------

  test('TC02 - Login should fail with invalid username', async ({ page }) => {

    await login(
      page,
      'invalidUser123',
      VALID_PASSWORD
    );

    // Login page should still be displayed
    await expect(page.locator('#username')).toBeVisible();
    await expect(page.locator('#password')).toBeVisible();

    console.log('TC02 PASSED - Invalid username rejected');
  });


  // ------------------------------------------------------
  // TC03 - Invalid Password
  // ------------------------------------------------------

  test('TC03 - Login should fail with invalid password', async ({ page }) => {

    await login(
      page,
      VALID_USERNAME,
      'WrongPassword123!'
    );

    await expect(page.locator('#username')).toBeVisible();
    await expect(page.locator('#password')).toBeVisible();

    console.log('TC03 PASSED - Invalid password rejected');
  });


  // ------------------------------------------------------
  // TC04 - Invalid Username and Password
  // ------------------------------------------------------

  test('TC04 - Login should fail with invalid username and password', async ({ page }) => {

    await login(
      page,
      'wrongUser',
      'WrongPassword123!'
    );

    await expect(page.locator('#username')).toBeVisible();
    await expect(page.locator('#password')).toBeVisible();

    console.log('TC04 PASSED - Invalid credentials rejected');
  });


  // ------------------------------------------------------
  // TC05 - Empty Username
  // ------------------------------------------------------

  test('TC05 - Login should fail when username is empty', async ({ page }) => {

    await page.goto(BASE_URL);

    await page.locator('#password').fill(VALID_PASSWORD);

    await page.getByRole('button', { name: 'Sign in' }).click();

    // Login form should remain visible
    await expect(page.locator('#username')).toBeVisible();

    console.log('TC05 PASSED - Empty username rejected');
  });


  // ------------------------------------------------------
  // TC06 - Empty Password
  // ------------------------------------------------------

  test('TC06 - Login should fail when password is empty', async ({ page }) => {

    await page.goto(BASE_URL);

    await page.locator('#username').fill(VALID_USERNAME);

    await page.getByRole('button', { name: 'Sign in' }).click();

    // Login form should remain visible
    await expect(page.locator('#password')).toBeVisible();

    console.log('TC06 PASSED - Empty password rejected');
  });


  // ------------------------------------------------------
  // TC07 - Empty Username and Password
  // ------------------------------------------------------

  test('TC07 - Login should fail when username and password are empty', async ({ page }) => {

    await page.goto(BASE_URL);

    await page.getByRole('button', { name: 'Sign in' }).click();

    await expect(page.locator('#username')).toBeVisible();
    await expect(page.locator('#password')).toBeVisible();

    console.log(
      'TC07 PASSED - Empty username and password rejected'
    );
  });

});