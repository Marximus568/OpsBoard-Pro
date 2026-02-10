import { test, expect } from '@playwright/test';

test.describe('Admin Feature', () => {
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

        // Navigate to admin
        await expect(page).toHaveURL(/.*dashboard/);
        await page.getByRole('link', { name: 'Admin' }).click();
        await expect(page).toHaveURL(/.*admin/);
    });

    test('should display user management', async ({ page }) => {
        // Navigate to user management
        await page.getByRole('link', { name: /users|usuarios/i }).click();
        await expect(page).toHaveURL(/.*admin\/users/);

        // Verify user table is visible
        await expect(page.locator('table')).toBeVisible();

        // Verify users are listed
        const userRows = page.locator('tbody tr');
        const count = await userRows.count();
        expect(count).toBeGreaterThan(0);
    });

    test('should create new user', async ({ page }) => {
        // Navigate to user management
        await page.getByRole('link', { name: /users|usuarios/i }).click();
        await expect(page).toHaveURL(/.*admin\/users/);

        // Click New User button
        await page.getByRole('button', { name: /new user|nuevo usuario/i }).click();

        // Fill user form
        await page.fill('#name', 'E2E Test User');
        await page.fill('#email', 'e2e.test@opsboard.com');
        await page.selectOption('#role', 'VIEWER');

        // Submit form
        await page.getByRole('button', { name: /save|guardar|create/i }).click();

        // Verify user was created
        await expect(page.locator('table')).toContainText('E2E Test User');
    });

    test('should edit user', async ({ page }) => {
        // Navigate to user management
        await page.getByRole('link', { name: /users|usuarios/i }).click();
        await expect(page).toHaveURL(/.*admin\/users/);

        // Click edit on first user
        const editButton = page.locator('button[aria-label*="edit"]').first();
        if (await editButton.isVisible()) {
            await editButton.click();

            // Modify user data
            await page.fill('#name', 'E2E Modified User');

            // Save changes
            await page.getByRole('button', { name: /save|guardar/i }).click();

            // Verify changes
            await expect(page.locator('table')).toContainText('E2E Modified User');
        }
    });

    test('should delete user', async ({ page }) => {
        // Navigate to user management
        await page.getByRole('link', { name: /users|usuarios/i }).click();
        await expect(page).toHaveURL(/.*admin\/users/);

        // Get initial count
        const initialCount = await page.locator('tbody tr').count();

        // Click delete on last user
        const deleteButton = page.locator('button[aria-label*="delete"]').last();
        if (await deleteButton.isVisible()) {
            await deleteButton.click();

            // Confirm deletion
            const confirmButton = page.getByRole('button', { name: /confirm|delete|eliminar/i });
            if (await confirmButton.isVisible()) {
                await confirmButton.click();
            }

            // Verify user was deleted
            const newCount = await page.locator('tbody tr').count();
            expect(newCount).toBeLessThan(initialCount);
        }
    });

    test('should display role management', async ({ page }) => {
        // Navigate to role management
        await page.getByRole('link', { name: /roles/i }).click();
        await expect(page).toHaveURL(/.*admin\/roles/);

        // Verify role cards are visible
        const roleCards = page.locator('.role-card');
        const count = await roleCards.count();
        expect(count).toBeGreaterThan(0);

        // Verify default roles exist
        await expect(page.locator('.role-card')).toContainText(/ADMIN|OPERATOR|VIEWER/i);
    });

    test('should display feature flags', async ({ page }) => {
        // Navigate to feature flags
        await page.getByRole('link', { name: /feature flags|flags/i }).click();
        await expect(page).toHaveURL(/.*admin\/feature-flags/);

        // Verify flags are displayed
        const flagItems = page.locator('.flag-item');
        const count = await flagItems.count();
        expect(count).toBeGreaterThan(0);
    });

    test('should toggle feature flag', async ({ page }) => {
        // Navigate to feature flags
        await page.getByRole('link', { name: /feature flags|flags/i }).click();
        await expect(page).toHaveURL(/.*admin\/feature-flags/);

        // Toggle first flag
        const firstToggle = page.locator('.switch input').first();
        const initialState = await firstToggle.isChecked();

        await firstToggle.click();

        // Verify state changed
        const newState = await firstToggle.isChecked();
        expect(newState).toBe(!initialState);
    });
});
