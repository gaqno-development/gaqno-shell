import { expect, test, Page } from '@playwright/test'
import { loginAsSuperAdmin } from './helpers/auth-helper'

const mobileViewport = { width: 390, height: 844 }

const moduleMenu = (page: Page) =>
  page.locator('[data-mobile="true"] [data-sidebar="menu"]').first()

const topBarTrigger = (page: Page) =>
  page.getByRole('button', { name: /open menu/i }).first()

test.describe('Mobile modules menu', () => {
  test.beforeEach(async ({ page }) => {
    await page.setViewportSize(mobileViewport)
    await loginAsSuperAdmin(page)
    await page.goto('/dashboard')
  })

  test('opens the modules drawer from hamburger trigger', async ({ page }) => {
    const trigger = topBarTrigger(page)
    const menu = moduleMenu(page)

    if (await menu.isVisible()) {
      await trigger.click()
      await expect(menu).toBeHidden()
    }

    await trigger.click()
    await expect(menu).toBeVisible()
    await expect(menu.getByText('PDV', { exact: true })).toBeVisible()
  })

  test('keeps the trigger toggling drawer visibility', async ({ page }) => {
    const trigger = topBarTrigger(page)
    const menu = moduleMenu(page)

    if (!(await menu.isVisible())) {
      await trigger.click()
      await expect(menu).toBeVisible()
    }

    await trigger.click()
    await expect(menu).toBeHidden()

    await trigger.click()
    await expect(menu).toBeVisible()
  })
})
