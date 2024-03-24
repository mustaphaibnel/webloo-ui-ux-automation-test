// @ts-nocheck
const { test, expect, devices } = require('@playwright/test');

test('Test Sign-Up Flow', async ({ page }) => {
  // Start video recording

  // Navigate to the initial page
  await page.goto('https://app.alpha.bzzr.info/');
  await page.screenshot({ path: `./screenshots/screenshot_1_${new Date().toISOString()}.png`, fullPage: true });

  // Navigate to login page
  await page.goto('https://app.alpha.bzzr.info/auth/login');
  await page.screenshot({ path: `./screenshots/screenshot_2_${new Date().toISOString()}.png`, fullPage: true });

  // Click on 'Sign up'
  await page.waitForSelector('text=Sign up');
  await page.click('text=Sign up');
  await page.screenshot({ path: `./screenshots/screenshot_3_${new Date().toISOString()}.png`, fullPage: true });

  // Click on 'Athlete? Sign up here'
  await page.waitForSelector('text=Athlete? Sign up here');
  await page.click('text=Athlete? Sign up here');
  await page.screenshot({ path: `./screenshots/screenshot_4_${new Date().toISOString()}.png`, fullPage: true });
  // Fill form fields with random values
  const randomFirstName = 'testplay' + Math.floor(Math.random() * 10000);
  const randomLastName = 'test' + Math.floor(Math.random() * 10000);
  const randomUsername = 'testplay' + Math.floor(Math.random() * 10000000000);
  const randomNumber = Math.floor(Math.random() * 10000);
  const randomEmail = `testplay${randomNumber}@test.co`;
  const randomPassword = 'Zt#321*' + Math.floor(Math.random() * 10000000000) + '*';

  await page.waitForSelector('input[placeholder="First Name"]');
  await page.fill('input[placeholder="First Name"]', randomFirstName);
  await page.waitForSelector('input[placeholder="Last Name"]');
  await page.fill('input[placeholder="Last Name"]', randomLastName);
  await page.waitForSelector('input[placeholder="Username"]');
  await page.fill('input[placeholder="Username"]', randomUsername);
  await page.waitForSelector('input[placeholder="Email Address"]');
  await page.fill('input[placeholder="Email Address"]', randomEmail);
  await page.waitForSelector('input[placeholder="Password"]');
  await page.fill('input[placeholder="Password"]', randomPassword);
  await page.screenshot({ path: `./screenshots/screenshot_5_${new Date().toISOString()}.png`, fullPage: true });

  // Click on 'CREATE ACCOUNT'
  //await page.waitForSelector('#root > div > div > div > div:nth-child(2) > div:nth-child(2) > div:nth-child(3) > .css-175oi2r');

  // Define your CSS selector.
  //const cssSelector = '#root > div > div > div > div.css-175oi2r.r-1awozwy.r-6koalj.r-1t2qqvi.r-1pi2tsx.r-1777fci > div.css-175oi2r > div.css-175oi2r.r-1awozwy.r-6koalj.r-18u37iz.r-1h0z5md > div.css-175oi2r.r-1loqt21.r-1otgn73';

  // Step 2 and 3: Find the element and click it.
  await page.click(cssSelector);


  // Selector based on text content. Adjust the page or context if needed.
  const buttonText = "CREATE ACCOUNT";
  const selector = `text="${buttonText}"`;

  // Wait for the element to be visible before clicking.
  await page.waitForSelector(selector, { state: 'visible' });

  // Click the element.
  await page.click(selector);

  //const createAccountDiv = await page.locator('div').filter(div => div.textContent().includes('CREATE ACCOUNT')).first();
  //await createAccountDiv.click();
  
  await page.screenshot({ path: `./screenshots/screenshot_6_${new Date().toISOString()}.png`, fullPage: true });

  // Click on 'CONTINUE'
  await page.waitForSelector('text=CONTINUE');
  //await page.click('text=CONTINUE');
  await page.screenshot({ path: `./screenshots/screenshot_7_${new Date().toISOString()}.png`, fullPage: true });

  // Perform further actions...

  // Stop video recording
  await page.context().tracing.stop();
});
