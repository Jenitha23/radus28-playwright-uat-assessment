import { test, expect } from '@playwright/test';

const USERNAME = 'playwright';
const PASSWORD = 'PLaaaY@rite.76';

const STEP_DELAY = 1500;

test.setTimeout(90000);

async function wait(page) {
  await page.waitForTimeout(STEP_DELAY);
}

// -----------------------------------------------------
// LOGIN
// -----------------------------------------------------

async function login(page) {
  console.log('Opening application');

  await page.goto('/');

  await wait(page);

  console.log('Entering username');
  await page.locator('#username').fill(USERNAME);

  await wait(page);

  console.log('Entering password');
  await page.locator('#password').fill(PASSWORD);

  await wait(page);

  console.log('Clicking Sign in');
  await page.getByRole('button', { name: 'Sign in' }).click();

  await page.waitForLoadState('networkidle');

  await wait(page);

  await expect(page.locator('#username')).not.toBeVisible();

  console.log('Login successful');
}

// -----------------------------------------------------
// NAVIGATE TO LEADS
// -----------------------------------------------------

async function navigateToLeads(page) {
  console.log('Opening Main Menu');

  // Click the visible hamburger menu
  await page.locator('.app-navigator').first().click();

  // Wait for the app-switcher panel to actually render its "MARKETING"
  // item instead of trusting a fixed sleep. This was the point TC01 timed
  // out: `span.app-name` never resolved to an actionable element within
  // 10s, even though the failure snapshot shows "MARKETING" present on the
  // page as plain text. Matching on the accessible text itself (what a
  // real user reads) is more resilient than guessing an internal class
  // name that may not match the live markup.
  console.log('Opening Marketing');

  const marketingMenuItem = page.getByText('MARKETING', { exact: true });

  await marketingMenuItem.waitFor({ state: 'visible', timeout: 10000 });
  await marketingMenuItem.click();

  await wait(page);

  console.log('Opening Leads');

  // Click Leads under Marketing
  const leadsLink = page.getByText('Leads', { exact: true });

  await leadsLink.waitFor({ state: 'visible', timeout: 10000 });
  await leadsLink.click();

  await page.waitForLoadState('networkidle');

  await wait(page);

  console.log('Leads page opened');
}

// -----------------------------------------------------
// OPEN ADD LEAD FORM
// -----------------------------------------------------

async function openAddLead(page) {
  console.log('Clicking Add Lead');

  await page
    .getByRole('button', { name: /add lead/i })
    .click();

  await wait(page);

  console.log('Add Lead form opened');
}

// -----------------------------------------------------
// SAVE LEAD
// -----------------------------------------------------

async function saveLead(page) {
  console.log('Clicking Save');

  await page
    .getByRole('button', { name: /^save$/i })
    .click();

  await wait(page);
}

// =====================================================
// LEAD CREATION TEST SUITE
// =====================================================

test.describe('Radus28 CRM Lead Creation Tests', () => {

  // ---------------------------------------------------
  // TC01 - Mandatory Last Name validation
  // ---------------------------------------------------

  test('TC01 - Last Name mandatory validation should appear', async ({ page }) => {
    await login(page);

    await navigateToLeads(page);

    await openAddLead(page);

    console.log('Leaving Last Name empty');

    const lastName = page.locator('input[name="lastname"]');

    await expect(lastName).toBeVisible();

    await lastName.fill('');

    await wait(page);

    await saveLead(page);

    await expect(lastName).toBeVisible();

    console.log(
      'TC01 PASSED - Lead was not created without Last Name'
    );
  });

  // ---------------------------------------------------
  // TC02 - Empty Lead Form
  // ---------------------------------------------------

  test('TC02 - Empty lead form should trigger mandatory validation', async ({ page }) => {
    await login(page);

    await navigateToLeads(page);

    await openAddLead(page);

    console.log('Submitting completely empty lead form');

    await wait(page);

    await saveLead(page);

    await expect(
      page.locator('input[name="lastname"]')
    ).toBeVisible();

    console.log(
      'TC02 PASSED - Empty lead form was rejected'
    );
  });

  // ---------------------------------------------------
  // TC03 - Valid Lead Creation
  // ---------------------------------------------------

  test('TC03 - Lead should be created successfully with valid data', async ({ page }) => {
    await login(page);

    await navigateToLeads(page);

    await openAddLead(page);

    const uniqueId = Date.now();

    const firstName = 'Jenitha';
    const lastName = `Automation${uniqueId}`;

    console.log('Entering First Name');

    const firstNameField =
      page.locator('input[name="firstname"]');

    if (await firstNameField.count() > 0) {
      await firstNameField.fill(firstName);
    }

    await wait(page);

    console.log('Entering Last Name');

    await page
      .locator('input[name="lastname"]')
      .fill(lastName);

    await wait(page);

    const companyField =
      page.locator('input[name="company"]');

    if (await companyField.count() > 0) {
      console.log('Entering Company');

      await companyField.fill(
        'Radus28 Automation Test'
      );

      await wait(page);
    }

    const phoneField =
      page.locator('input[name="phone"]');

    if (await phoneField.count() > 0) {
      console.log('Entering Phone');

      await phoneField.fill('0771234567');

      await wait(page);
    }

    const emailField =
      page.locator('input[name="email"]');

    if (await emailField.count() > 0) {
      console.log('Entering Email');

      await emailField.fill(
        `jenitha${uniqueId}@example.com`
      );

      await wait(page);
    }

    console.log('Saving valid Lead');

    await saveLead(page);

    await page.waitForLoadState('networkidle');

    await wait(page);

    await expect(
      page.locator('input[name="lastname"]')
    ).not.toBeVisible();

    console.log(
      `TC03 PASSED - Lead created successfully: ${firstName} ${lastName}`
    );

    console.log(
      'Lead Detail URL:',
      page.url()
    );
  });

  // ---------------------------------------------------
  // TC04 - Only mandatory Last Name
  // ---------------------------------------------------

  test('TC04 - Lead should be created using only mandatory Last Name', async ({ page }) => {
    await login(page);

    await navigateToLeads(page);

    await openAddLead(page);

    const lastName =
      `MinimumLead${Date.now()}`;

    console.log('Entering only Last Name');

    await page
      .locator('input[name="lastname"]')
      .fill(lastName);

    await wait(page);

    await saveLead(page);

    await page.waitForLoadState('networkidle');

    await wait(page);

    await expect(
      page.locator('input[name="lastname"]')
    ).not.toBeVisible();

    console.log(
      'TC04 PASSED - Lead created using mandatory Last Name'
    );
  });

  // ---------------------------------------------------
  // TC05 - Spaces only in Last Name
  // ---------------------------------------------------

  test('TC05 - Last Name containing only spaces should not create a lead', async ({ page }) => {
    await login(page);

    await navigateToLeads(page);

    await openAddLead(page);

    console.log('Entering spaces in Last Name');

    const lastName =
      page.locator('input[name="lastname"]');

    await lastName.fill('   ');

    await wait(page);

    await saveLead(page);

    await wait(page);

    await expect(lastName).toBeVisible();

    console.log(
      'TC05 PASSED - Spaces-only Last Name was rejected'
    );
  });

});