import {test,expect} from '@playwright/test';
test('login screen renders and validates fields',async({page})=>{await page.goto('/login');await expect(page.getByRole('heading',{name:'Sign in to Frameflow'})).toBeVisible();await expect(page.getByLabel('Work email')).toBeVisible();await expect(page.getByLabel('Password')).toBeVisible()});
