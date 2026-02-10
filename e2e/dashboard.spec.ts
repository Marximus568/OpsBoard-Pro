import { test, expect } from '@playwright/test';

test.describe('Dashboard Feature', () => {
    test.beforeEach(async ({ page }) => {
        // Login before each test
        await page.goto('http://localhost:4200/auth/login');
        await page.fill('#email', 'admin@opsboard.com');
        await page.fill('#password', 'hashed_password_123');
        await page.click('button[type="submit"]');

        // MFA
        await expect(page.locator('label[for="code"]')).toBeVisible();
        await page.fill('#code', '123456');
        await page.click('button[type="submit"]');

        // Wait for dashboard
        await expect(page).toHaveURL(/.*dashboard/);
    });

    test('should display KPI cards', async ({ page }) => {
        // Verify KPI cards are visible (dashboard has 5 KPI cards)
        await expect(page.locator('app-kpi-card')).toHaveCount(5);

        // Verify KPI cards contain data
        const kpiCards = page.locator('app-kpi-card');
        await expect(kpiCards.first()).toBeVisible();
    });

    test('should display recent incidents list', async ({ page }) => {
        // Verify recent incidents component is visible
        await expect(page.locator('app-recent-incidents-list')).toBeVisible();

        // Verify table has rows
        const tableRows = page.locator('app-recent-incidents-list tbody tr');
        const count = await tableRows.count();
        expect(count).toBeGreaterThan(0);
    });

    test('should display charts', async ({ page }) => {
        // Verify severity bar chart
        await expect(page.locator('app-severity-bar-chart')).toBeVisible();

        // Verify distribution pie chart
        await expect(page.locator('app-distribution-pie-chart')).toBeVisible();
    });

    test('should navigate to incidents from dashboard', async ({ page }) => {
        // Click on "View All" or navigate to incidents
        await page.getByRole('link', { name: 'Incidents' }).click();
        await expect(page).toHaveURL(/.*incidents/);
    });
});
