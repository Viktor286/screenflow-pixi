const deviceList = require('./deviceList');
const fs = require('fs').promises;
const path = require('path');
const puppeteer = require('puppeteer');
const { time } = require('./utils');

const targetDir = '/initialView';
const targetPath = path.normalize(__dirname + targetDir);
const targetUrl = 'http://localhost:3000/';
// const targetUrl = 'chrome://gpu'; // chrome://gpu

process.env.PUPPETEER_SKIP_CHROMIUM_DOWNLOAD = 'true';

// args: [
//   // '--info', // doesn't pipe
//   // '--verbose', // doesn't pipe
//   // '--enable-webgl',
// ]

(async () => {
  // console.log(puppeteer.defaultArgs());
  console.info(`[${time()}] Starting automated screenshot verification for ${deviceList.length} devices`);

  const browser = await puppeteer.launch({
    headless: false,
    defaultViewport: {
      width: deviceList[0].viewport.width,
      height: deviceList[0].viewport.height,
    },
  });

  const page = await browser.newPage();
  console.info(`[${time()}] Open browser at ${targetUrl}, wait for network loading...`);
  await page.goto(targetUrl, { waitUntil: ['domcontentloaded', 'networkidle0'] });
  console.info(`[${time()}] domcontentloaded and networkidle0.`);

  for (const device of deviceList) {
    console.info(`[${time()}] Verifying initialView screenshot for device "${device.name}"`);
    await verifyScreenshot(page, device);
  }

  console.info(`[${time()}] All screenshots look good! Closing browser`);
  await browser.close();
})();

async function verifyScreenshot(page, device) {
  const fileNamePath = `${targetPath}/${device.name}.png`;
  await page.emulate(device);
  await page.screenshot({ path: fileNamePath });
  await compareScreenshots(device.name);
  await fs.unlink(fileNamePath);
}

async function compareScreenshots(screenshotFileName) {
  let screenshot = {};

  try {
    screenshot = {
      origin: await fs.readFile(`${targetPath}/${screenshotFileName}A.png`),
      current: await fs.readFile(`${targetPath}/${screenshotFileName}.png`),
    };
  } catch (error) {
    console.error(`[${time()}] Error comparing ${targetDir}/${screenshotFileName}.png `, error);
    process.exit(1);
  }

  if (screenshot.origin.compare(screenshot.current) !== 0) {
    throw new Error(`[${time()}] Screenshot buffers verification for "${screenshotFileName}" is failed.`);
  } else {
    console.log(`[${time()}] "${screenshotFileName}" is OK.`);
  }
}
