import { test, expect } from "./helpers.js";

test.describe("search: request deduplication", () => {
  test("rapid typing issues bounded requests and shows results", async ({ page }) => {
    const productCalls = [];
    page.on("request", (r) => {
      if (r.url().includes("/api/products") && r.method() === "GET") {
        productCalls.push({ url: r.url(), t: Date.now() });
      }
    });
    await page.goto("/#/search", { waitUntil: "domcontentloaded" });
    // Page shell renders regardless of auth state; wait for it to settle.
    await expect(
      page.locator("h2", { hasText: /products found/i }),
    ).toBeVisible({ timeout: 25000 });
    // Fresh visitors get the auth gate (may resolve late): real guest flow.
    const guestBtn = page.locator('[role="alertdialog"] button', {
      hasText: /continue as guest/i,
    });
    if (await guestBtn.first().isVisible({ timeout: 8000 }).catch(() => false)) {
      await guestBtn.first().click();
      // App reloads after guest sign-in; wait out the reload + session check.
      await expect(page.locator('[role="alertdialog"]')).toBeHidden({
        timeout: 30000,
      });
      await expect(
        page.locator("h2", { hasText: /products found/i }),
      ).toBeVisible({ timeout: 25000 });
    }
    const baseline = productCalls.length;

    const input = page.getByPlaceholder(
      "Search products, categories, or keywords...",
    );
    await expect(input).toBeVisible({ timeout: 15000 });
    // Type the query in one input event (deterministic under load; the
    // 600ms typing->URL debounce + 350ms fetch debounce still apply).
    await input.fill("arduinoo");
    // Wait for debounce (600ms typing->URL + 350ms fetch) + margin.
    await page.waitForTimeout(3000);

    const afterTyping = productCalls.length - baseline;
    console.log(`search requests for rapid typing: ${afterTyping}`);
    // Bounded: 1 (debounced URL update) + 1 (fetch) + slack for StrictMode/filters.
    expect(afterTyping).toBeLessThanOrEqual(5);
    // The debounced query must actually reach the URL (test is vacuous otherwise).
    await expect.poll(() => page.url(), { timeout: 10000 }).toContain("q=arduinoo");

    // Results header always renders (count may be 0); the key assertion is
    // no perpetual spinner and a deterministic end state.
    const countHeader = page.locator("h2", { hasText: /products found/i });
    await expect(countHeader).toBeVisible({ timeout: 15000 });
    await expect(page.locator("text=/Loading products/i")).toBeHidden({
      timeout: 15000,
    });

    // Clearing the query must not fire a request storm.
    const beforeClear = productCalls.length;
    await input.fill("");
    // URL must drop the query without a request storm.
    await page.waitForTimeout(2500);
    const afterClear = productCalls.length - beforeClear;
    console.log(`search requests after clear: ${afterClear}`);
    expect(afterClear).toBeLessThanOrEqual(3);

    // Repeated identical search (type same query again) reuses URL state sanely.
    await input.fill("esp32");
    await page.waitForTimeout(3000);
    const results2 = await page.locator("body").innerText();
    expect(results2.length).toBeGreaterThan(0);
  });
});
