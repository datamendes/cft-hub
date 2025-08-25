import { chromium } from 'playwright';

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  try {
    await page.goto('http://localhost:8080/', { waitUntil: 'domcontentloaded', timeout: 5000 });
    const buttons = await page.$$eval('button, [role="button"]', els => els.map(el => el.textContent?.trim()));
    console.log('Buttons on page:', buttons);
  } catch (err) {
    console.error('Navigation failed:', err);
  } finally {
    await browser.close();
  }
})();
