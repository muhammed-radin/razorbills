import { expect } from "./helpers.js";

/** Dismiss the guest gate if present (fresh browser profile). */
export async function ensureGuest(page) {
  const guestBtn = page.locator('[role="alertdialog"] button', {
    hasText: /continue as guest/i,
  });
  if (await guestBtn.first().isVisible({ timeout: 8000 }).catch(() => false)) {
    await guestBtn.first().click();
    await expect(page.locator('[role="alertdialog"]')).toBeHidden({
      timeout: 30000,
    });
  }
}

export async function gotoGuest(page, hash) {
  await page.goto(`/#${hash}`, { waitUntil: "domcontentloaded" });
  await ensureGuest(page);
}

/** Real UI signup. Returns { name, email, password }. */
export async function signupAs(page, tag) {
  const email = `pw-${Date.now().toString(36)}-${tag}@example.com`;
  const user = { name: `PW ${tag}`, email, password: "Test1234!" };
  await page.goto("/#/signup", { waitUntil: "domcontentloaded" });
  await page.getByPlaceholder(/full name|name/i).first().fill(user.name);
  await page.getByPlaceholder(/email/i).first().fill(user.email);
  await page.getByPlaceholder(/password/i).first().fill(user.password);
  await page.getByRole("button", { name: /continue with email/i }).click();
  // Success lands on / (auto-login) or /login.
  await page.waitForURL(/.*#\/$|.*#\/login.*/, { timeout: 25000 });
  return user;
}

/** Real UI login. */
export async function loginAs(page, email, password) {
  await page.goto("/#/login", { waitUntil: "domcontentloaded" });
  await page.getByPlaceholder(/email/i).first().fill(email);
  await page.getByPlaceholder(/password/i).first().fill(password);
  await page.getByRole("button", { name: /continue with email/i }).click();
  await page.waitForURL(/.*#\/$/, { timeout: 25000 });
  await expect(page.locator('[role="alertdialog"]')).toBeHidden({
    timeout: 15000,
  });
}
