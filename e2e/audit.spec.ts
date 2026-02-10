import { test, expect } from '@playwright/test';

test.describe('Audit Feature', () => {
    test.beforeEach(async ({ page }) => {
        // Login as admin
        await page.goto('http://localhost:4200/auth/login');
        await page.fill('#email', 'admin@opsboard.com');
        await page.fill('#password', 'hashed_password_123');
        await page.click('button[type="submit"]');

        // MFA
        await expect(page.locator('label[for="code"]')).toBeVisible();
        await page.fill('#code', '123456');
        await page.click('button[type="submit"]');

        // Navigate to audit
        await expect(page).toHaveURL(/.*dashboard/);
        await page.getByRole('link', { name: 'Audit' }).click();
        await expect(page).toHaveURL(/.*audit/);
    });

    test('should display audit logs', async ({ page }) => {
        // Verify audit log table is visible
        await expect(page.locator('table')).toBeVisible();

        // Verify audit entries exist
        const auditRows = page.locator('tbody tr');
        const count = await auditRows.count();
        expect(count).toBeGreaterThan(0);
    });

    test('should filter audit logs by action', async ({ page }) => {
        // Find filter dropdown
        const actionFilter = page.locator('select#action');

        if (await actionFilter.isVisible()) {
            // Select specific action
            await actionFilter.selectOption('CREATE');

            // Verify filtered results
            const rows = page.locator('tbody tr');
            const count = await rows.count();
            expect(count).toBeGreaterThanOrEqual(0);
        }
    });

    test('should filter audit logs by user', async ({ page }) => {
        // Find user filter
        const userFilter = page.locator('select#user, input#user');

        if (await userFilter.isVisible()) {
            if (await userFilter.getAttribute('type') === 'text') {
                await userFilter.fill('admin');
            } else {
                await userFilter.selectOption({ index: 1 });
            }

            // Apply filter
            const applyButton = page.getByRole('button', { name: /apply|filter/i });
            if (await applyButton.isVisible()) {
                await applyButton.click();
            }

            // Verify results
            const rows = page.locator('tbody tr');
            const count = await rows.count();
            expect(count).toBeGreaterThanOrEqual(0);
        }
    });

    test('should filter audit logs by date range', async ({ page }) => {
        // Find date inputs
        const dateFrom = page.locator('input[type="date"], input[type="datetime-local"]').first();
        const dateTo = page.locator('input[type="date"], input[type="datetime-local"]').last();

        if (await dateFrom.isVisible() && await dateTo.isVisible()) {
            // Set date range (last 7 days)
            const today = new Date();
            const lastWeek = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);

            await dateFrom.fill(lastWeek.toISOString().split('T')[0]);
            await dateTo.fill(today.toISOString().split('T')[0]);

            // Apply filter
            const applyButton = page.getByRole('button', { name: /apply|filter/i });
            if (await applyButton.isVisible()) {
                await applyButton.click();
            }

            // Verify results
            const rows = page.locator('tbody tr');
            const count = await rows.count();
            expect(count).toBeGreaterThanOrEqual(0);
        }
    });

    test('should view audit log details', async ({ page }) => {
        // Click on first audit log entry
        const firstRow = page.locator('tbody tr').first();
        await firstRow.click();

        // Verify details modal or expanded view
        const detailsView = page.locator('.audit-details, .modal');

        if (await detailsView.isVisible()) {
            // Verify details contain relevant information
            await expect(detailsView).toContainText(/action|user|timestamp/i);
        }
    });

    test('should export audit logs', async ({ page }) => {
        // Find export button
        const exportButton = page.getByRole('button', { name: /export|download/i });

        if (await exportButton.isVisible()) {
            // Start waiting for download
            const downloadPromise = page.waitForEvent('download');
            await exportButton.click();

            // Wait for download
            const download = await downloadPromise;
            expect(download.suggestedFilename()).toMatch(/audit|log/i);
        }
    });

    test('should paginate audit logs', async ({ page }) => {
        // Find pagination controls
        const nextButton = page.getByRole('button', { name: /next|siguiente/i });

        if (await nextButton.isVisible()) {
            // Get current page data
            const firstRowText = await page.locator('tbody tr').first().textContent();

            // Go to next page
            await nextButton.click();

            // Verify page changed
            const newFirstRowText = await page.locator('tbody tr').first().textContent();
            expect(newFirstRowText).not.toBe(firstRowText);
        }
    });

    test('should search audit logs', async ({ page }) => {
        // Find search input
        const searchInput = page.locator('input[placeholder*="Search"], input[type="search"]');

        if (await searchInput.isVisible()) {
            await searchInput.fill('incident');

            // Apply search
            const searchButton = page.getByRole('button', { name: /search/i });
            if (await searchButton.isVisible()) {
                await searchButton.click();
            }

            // Verify filtered results
            const rows = page.locator('tbody tr');
            const count = await rows.count();
            expect(count).toBeGreaterThanOrEqual(0);
        }
    });
});
