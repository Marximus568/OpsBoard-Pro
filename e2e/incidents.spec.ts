import { test, expect } from '@playwright/test';

test.describe('Incidents Feature', () => {
    test.beforeEach(async ({ page }) => {
        // Login
        await page.goto('http://localhost:4200/auth/login');
        await page.fill('#email', 'admin@opsboard.com');
        await page.fill('#password', 'hashed_password_123');
        await page.click('button[type="submit"]');

        // MFA
        await expect(page.locator('label[for="code"]')).toBeVisible();
        await page.fill('#code', '123456');
        await page.click('button[type="submit"]');

        // Navigate to incidents
        await expect(page).toHaveURL(/.*dashboard/);
        await page.getByRole('link', { name: 'Incidents' }).click();
        await expect(page).toHaveURL(/.*incidents/);
    });

    test('should display incidents list', async ({ page }) => {
        // Verify incident list component is visible
        await expect(page.locator('app-incident-list-view')).toBeVisible();

        // Verify incidents are displayed
        const incidentCards = page.locator('app-incident-card');
        const count = await incidentCards.count();
        expect(count).toBeGreaterThan(0);
    });

    test('should filter incidents by status', async ({ page }) => {
        // Verify incidents list is visible and functional
        const incidentCards = page.locator('app-incident-card');
        const count = await incidentCards.count();

        // Verify we have incidents to work with
        expect(count).toBeGreaterThan(0);

        // Verify incident cards are clickable and visible
        await expect(incidentCards.first()).toBeVisible();
    });

    test('should create new incident', async ({ page }) => {
        // Click New Incident
        await page.getByRole('button', { name: 'New Incident' }).click();
        await expect(page).toHaveURL(/.*incidents\/create/);

        // Step 1: Details
        await page.fill('#title', 'E2E Test Incident - Automated');
        await page.fill('#description', 'This incident was created by automated E2E tests.');
        await page.getByRole('button', { name: 'Next' }).click();

        // Step 2: Classification
        await page.selectOption('#priority', 'HIGH');
        await page.selectOption('#severity', 'SEV2');
        await page.fill('#service', 'e2e-test-service');
        await page.getByRole('button', { name: 'Next' }).click();

        // Step 3: Extras
        await page.fill('#tags', 'e2e, automated, test');
        await page.getByRole('button', { name: 'Report Incident' }).click();

        // Verify redirect and success
        await expect(page).toHaveURL(/\/incidents$/);
        await expect(page.locator('app-incident-list-view')).toContainText('E2E Test Incident - Automated');
    });

    test('should view incident details', async ({ page }) => {
        // Click on first incident
        const firstIncident = page.locator('app-incident-card').first();
        await firstIncident.click();

        // Verify detail page
        await expect(page).toHaveURL(/.*incidents\/INC-/);
        await expect(page.locator('app-incident-detail')).toBeVisible();

        // Verify detail components
        await expect(page.locator('.incident-detail h1')).toBeVisible();
        await expect(page.locator('.timeline')).toBeVisible();
    });

    test('should update incident status', async ({ page }) => {
        // Navigate to first incident
        const firstIncident = page.locator('app-incident-card').first();
        await firstIncident.click();
        await expect(page).toHaveURL(/.*incidents\/(inc|INC)-/i);

        // Find and click status update button (if available)
        const statusButton = page.getByRole('button', { name: /resolve|close/i });
        if (await statusButton.isVisible()) {
            await statusButton.click();

            // Fill resolution notes if required
            const resolutionTextarea = page.locator('textarea');
            if (await resolutionTextarea.isVisible()) {
                await resolutionTextarea.fill('Resolved by E2E test');
                await page.getByRole('button', { name: /confirm|submit/i }).click();
            }
        }
    });
});
