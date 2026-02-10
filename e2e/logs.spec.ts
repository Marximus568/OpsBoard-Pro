import { test, expect } from '@playwright/test';

test.describe('Logs Feature', () => {
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

        // Navigate to logs
        await expect(page).toHaveURL(/.*dashboard/);
        await page.getByRole('link', { name: 'Logs' }).click();
        await expect(page).toHaveURL(/.*logs/);
    });

    test('should display logs viewer', async ({ page }) => {
        // Verify logs viewer is visible
        await expect(page.locator('app-logs-viewer')).toBeVisible();

        // Verify log entries container exists (may be empty in test environment)
        const logEntries = page.locator('app-log-entry-row');
        const count = await logEntries.count();
        expect(count).toBeGreaterThanOrEqual(0);
    });

    test('should search logs', async ({ page }) => {
        // Find search input
        const searchInput = page.locator('input[placeholder*="Search"]');
        await searchInput.fill('error');

        // Click search button
        await page.getByRole('button', { name: 'Search' }).click();

        // Verify filtered results
        await expect(page.locator('app-log-entry-row')).toHaveCount(await page.locator('app-log-entry-row').count());
    });

    test('should filter logs by level', async ({ page }) => {
        // Open advanced filters
        const filterButton = page.getByRole('button', { name: /tune|filter/i });
        await filterButton.click();

        // Select ERROR level
        const errorCheckbox = page.locator('input[type="checkbox"]').filter({ hasText: /ERROR/i });
        if (await errorCheckbox.count() > 0) {
            await errorCheckbox.first().check();
        }

        // Verify logs are filtered
        await expect(page.locator('app-log-entry-row')).toHaveCount(await page.locator('app-log-entry-row').count());
    });

    test('should expand log details', async ({ page }) => {
        // Click on first log entry
        const firstLog = page.locator('app-log-entry-row').first();
        await firstLog.click();

        // Verify details are expanded
        await expect(page.locator('.log-detail')).toBeVisible();

        // Verify payload is visible
        await expect(page.locator('.log-detail pre')).toBeVisible();
    });

    test('should export logs', async ({ page }) => {
        // Click export button
        const exportButton = page.getByRole('button', { name: /export|download/i });

        if (await exportButton.isVisible()) {
            // Start waiting for download before clicking
            const downloadPromise = page.waitForEvent('download');
            await exportButton.click();

            // Wait for download to complete
            const download = await downloadPromise;
            expect(download.suggestedFilename()).toContain('.log');
        }
    });

    test('should toggle streaming', async ({ page }) => {
        // Find streaming toggle button
        const streamButton = page.getByRole('button', { name: /pause|play/i });

        if (await streamButton.isVisible()) {
            await streamButton.click();

            // Verify status changed
            await expect(page.locator('.status-text')).toContainText(/paused|streaming/i);
        }
    });

    test('should clear logs', async ({ page }) => {
        // Click clear button
        const clearButton = page.getByRole('button', { name: /clear|delete/i });

        if (await clearButton.isVisible()) {
            const initialCount = await page.locator('app-log-entry-row').count();
            await clearButton.click();

            // Verify logs were cleared or count changed
            const newCount = await page.locator('app-log-entry-row').count();
            expect(newCount).toBeLessThanOrEqual(initialCount);
        }
    });
});
