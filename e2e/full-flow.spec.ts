import { test, expect } from '@playwright/test';

test.describe('OpsBoard-Pro Full Flow', () => {
    test('should login and create an incident', async ({ page }) => {
        // 1. Login
        await page.goto('http://localhost:4200/auth/login');
        await page.fill('#email', 'admin@opsboard.com');
        await page.fill('#password', 'hashed_password_123');
        await page.click('button[type="submit"]');

        // 2. MFA
        await expect(page.locator('label[for="code"]')).toBeVisible();
        await page.fill('#code', '123456');
        await page.click('button[type="submit"]');

        // 3. Navigation to Incidents
        await expect(page).toHaveURL(/.*dashboard/);
        await page.getByRole('link', { name: 'Incidents' }).click();
        await expect(page).toHaveURL(/.*incidents/);

        // 4. Create Incident
        await page.getByRole('button', { name: 'New Incident' }).click();
        await expect(page).toHaveURL(/.*incidents\/create/);

        // Step 1: Details
        await page.fill('#title', 'E2E Test Incident');
        await page.fill('#description', 'This is an incident created by the automated E2E test suite.');
        await page.getByRole('button', { name: 'Next' }).click();

        // Step 2: Classification
        await page.selectOption('#priority', 'HIGH');
        await page.selectOption('#severity', 'SEV2');
        await page.fill('#service', 'e2e-service');
        await page.getByRole('button', { name: 'Next' }).click();

        // Step 3: Extras
        await page.fill('#tags', 'e2e, test, playwright');
        await page.getByRole('button', { name: 'Report Incident' }).click();

        // 5. Verify Redirect and Success
        await expect(page).toHaveURL(/\/incidents$/);
        // Verify the newly created incident is in the list
        await expect(page.locator('app-incident-list-view')).toContainText('E2E Test Incident');
    });
});
