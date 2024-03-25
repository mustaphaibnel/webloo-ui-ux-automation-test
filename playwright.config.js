const { defineConfig, devices } = require('@playwright/test');

/**
 * Read environment variables from file.
 * https://github.com/motdotla/dotenv
 */
// require('dotenv').config();

module.exports = defineConfig({
  testDir: './e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: 'html',
  use: {
    // Uncomment the baseURL if you have a specific base URL for your tests
    // baseURL: 'http://127.0.0.1:3000',

    // Configure video recording to be on for every test
    video: {
      mode: 'on', // Record video for each test
      size: { width: 1280, height: 720 },
    },

    // Automatically take a screenshot on test failure
    screenshot: 'on',

    // Enable trace on first retry
    trace: 'on-first-retry',
  },

  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    // Other browser configurations...
  ],

  // Optional: Configure your local dev server
  // webServer: {
  //   command: 'npm run start',
  //   url: 'http://127.0.0.1:3000',
  //   reuseExistingServer: !process.env.CI,
  // },
});
