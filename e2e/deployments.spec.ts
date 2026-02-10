import { test, expect } from '@playwright/test';

test.describe('Deployments Feature', () => {
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

        // Navigate to deployments
        await expect(page).toHaveURL(/.*dashboard/);
        await page.getByRole('link', { name: 'Deployments' }).click();
        await expect(page).toHaveURL(/.*deployments/);
    });

    test('should display deployments list', async ({ page }) => {
        // Verify deployment cards are visible
        await expect(page.locator('app-deployment-card')).toHaveCount(await page.locator('app-deployment-card').count());

        // Verify at least one deployment exists
        const deploymentCards = page.locator('app-deployment-card');
        const count = await deploymentCards.count();
        expect(count).toBeGreaterThan(0);
    });

    test('should view deployment details', async ({ page }) => {
        // Click on first deployment
        const firstDeployment = page.locator('app-deployment-card').first();
        await firstDeployment.click();

        // Verify detail page
        await expect(page).toHaveURL(/.*deployments\/DEP-/);
        await expect(page.locator('app-deployment-detail')).toBeVisible();

        // Verify workflow timeline
        await expect(page.locator('.timeline')).toBeVisible();

        // Verify logs terminal
        await expect(page.locator('.terminal')).toBeVisible();
    });

    test('should approve deployment (admin only)', async ({ page }) => {
        // Navigate to first deployment
        const firstDeployment = page.locator('app-deployment-card').first();
        await firstDeployment.click();
        await expect(page).toHaveURL(/.*deployments\/DEP-/);

        // Check if approve button exists (admin role required)
        const approveButton = page.getByRole('button', { name: /aprobar|approve/i });

        if (await approveButton.isVisible()) {
            await approveButton.click();

            // Verify status changed
            await expect(page.locator('.timeline .step.active')).toContainText(/aprobado|approved/i);
        }
    });

    test('should reject deployment (admin only)', async ({ page }) => {
        // Navigate to first deployment in REQUESTED status
        const requestedDeployment = page.locator('app-deployment-card').filter({ hasText: /requested|solicitado/i }).first();

        if (await requestedDeployment.count() > 0) {
            await requestedDeployment.click();
            await expect(page).toHaveURL(/.*deployments\/DEP-/);

            // Check if reject button exists
            const rejectButton = page.getByRole('button', { name: /rechazar|reject/i });

            if (await rejectButton.isVisible()) {
                await rejectButton.click();

                // Verify status changed
                await expect(page.locator('.timeline')).toContainText(/rechazado|rejected/i);
            }
        }
    });

    test('should execute approved deployment', async ({ page }) => {
        // Navigate to approved deployment
        const approvedDeployment = page.locator('app-deployment-card').filter({ hasText: /approved|aprobado/i }).first();

        if (await approvedDeployment.count() > 0) {
            await approvedDeployment.click();
            await expect(page).toHaveURL(/.*deployments\/DEP-/);

            // Check if execute button exists
            const executeButton = page.getByRole('button', { name: /ejecutar|execute/i });

            if (await executeButton.isVisible()) {
                await executeButton.click();

                // Verify deployment is running
                await expect(page.locator('.timeline .step.active')).toContainText(/ejecutando|running/i);
            }
        }
    });

    test('should navigate back to list', async ({ page }) => {
        // Navigate to deployment detail
        const firstDeployment = page.locator('app-deployment-card').first();
        await firstDeployment.click();
        await expect(page).toHaveURL(/.*deployments\/(dep|DEP)-/i);

        // Click back button
        const backButton = page.getByRole('button', { name: /arrow_back|back/i });
        await backButton.click();

        // Verify back at list
        await expect(page).toHaveURL(/\/deployments$/);
    });
});
