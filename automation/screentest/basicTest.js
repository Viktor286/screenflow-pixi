const deviceList = require('./deviceList');
const fs = require('fs').promises;
const path = require('path');
const puppeteer = require('puppeteer');
const pixelmatch = require('pixelmatch');
const PNG = require('pngjs').PNG;
const { time, windowSet } = require('./utils');

const targetDir = '/initialView';
const targetPath = path.normalize(__dirname + targetDir);
const targetUrl = 'http://localhost:3000/';
// const targetUrl = 'chrome://gpu'; // chrome://gpu

process.env.PUPPETEER_SKIP_CHROMIUM_DOWNLOAD = 'true';

process.on('unhandledRejection', (err) => {
  throw err;
});

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

  windowSet(page, 'automationScreenshot', true);

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
  await compareScreenshots(device);
}

async function compareScreenshots({ name: screenshotFileName }) {
  let screenshot = {};

  try {
    screenshot = {
      origin: await fs.readFile(`${targetPath}/${screenshotFileName}[A].png`),
      current: await fs.readFile(`${targetPath}/${screenshotFileName}.png`),
    };
  } catch (error) {
    console.error(`[${time()}] Error comparing ${targetDir}/${screenshotFileName}.png `, error);
    process.exit(1);
  }

  try {
    // remove diff from prev check error
    await fs.unlink(`${targetPath}/${screenshotFileName}[D].png`);
  } catch (error) {
    // pass
  }

  try {
    // remove current from prev check error
    await fs.unlink(`${targetPath}/${screenshotFileName}.png`);
  } catch (error) {
    // pass
  }

  // try buffer comparison first
  if (screenshot.origin.compare(screenshot.current) !== 0) {
    const origin = PNG.sync.read(screenshot.origin);
    const current = PNG.sync.read(screenshot.current);
    const { width, height } = origin;
    const diff = new PNG({ width, height });

    // returns the number of mismatched pixels
    // https://www.npmjs.com/package/pixelmatch
    const pixelMismatchValue = pixelmatch(origin.data, current.data, diff.data, width, height, {
      threshold: 0.35,
    });

    console.log(`[${time()}] pixelMismatchValue:`, pixelMismatchValue);

    if (pixelMismatchValue > 185) {
      await fs.writeFile(`${targetPath}/${screenshotFileName}[D].png`, PNG.sync.write(diff));
      await fs.writeFile(`${targetPath}/${screenshotFileName}.png`, screenshot.current);
      console.error(`[${time()}] Screenshot verification for "${screenshotFileName}" is failed.`);
      process.exit(1);
    } else {
      // await fs.writeFile(`${targetPath}/${screenshotFileName}[D].png`, PNG.sync.write(diff));
      // await fs.writeFile(`${targetPath}/${screenshotFileName}.png`, screenshot.current);
      console.log(`[${time()}] "${screenshotFileName}" is OK.`);
    }
  } else {
    console.log(`[${time()}] "${screenshotFileName}" is OK.`);
  }

  return true;
}
