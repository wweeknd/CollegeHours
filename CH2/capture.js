const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

(async () => {
  const screenshotsDir = path.join(__dirname, 'screenshots');
  if (!fs.existsSync(screenshotsDir)){
      fs.mkdirSync(screenshotsDir);
  }

  console.log('Launching browser...');
  const browser = await puppeteer.launch({ headless: 'new' });
  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900 });

  // 1. Login Page
  console.log('Capturing Login Page...');
  await page.goto('http://localhost:5173/login', { waitUntil: 'networkidle0' });
  await page.screenshot({ path: path.join(screenshotsDir, '1_Login.png') });

  // 2. Click "Demo Student" to login
  console.log('Logging in as Demo Student...');
  const clicked = await page.evaluate(() => {
    const btns = Array.from(document.querySelectorAll('button'));
    const target = btns.find(b => b.textContent.includes('Demo Student'));
    if (target) {
      target.click();
      return true;
    }
    return false;
  });

  if (clicked) {
    await page.waitForNavigation({ waitUntil: 'networkidle0' });
    
    // Dashboard Page
    console.log('Capturing Dashboard...');
    await page.screenshot({ path: path.join(screenshotsDir, '2_Dashboard.png') });

    // 3. Navigate to Profile
    console.log('Navigating to Profile...');
    await page.goto('http://localhost:5173/profile', { waitUntil: 'networkidle0' });
    await page.screenshot({ path: path.join(screenshotsDir, '3_Profile.png') });
  } else {
    console.log('Could not find Demo Student button!');
  }

  await browser.close();
  console.log('Screenshots saved successfully!');
})();
