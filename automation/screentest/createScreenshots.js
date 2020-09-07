const deviceList = require('./deviceList');
const { time, windowSet } = require('./utils');
const puppeteer = require('puppeteer');
const path = require('path');

const targetDir = '/initialView';
const targetPath = path.normalize(__dirname + targetDir);
const targetUrl = 'http://localhost:3000/';

process.env.PUPPETEER_SKIP_CHROMIUM_DOWNLOAD = 'true';

process.on('unhandledRejection', (err) => {
  throw err;
});

(async () => {
  console.info(`[${time()}] Starting automated screenshot production for ${deviceList.length} devices`);

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
    const fileName = `${device.name}[A].png`;
    const path = `${targetPath}/${fileName}`;

    console.info(
      `[${time()}] Making initialView screenshot for device ${device.name}: ${targetDir}/${fileName}`,
    );
    await page.emulate(device);
    await page.screenshot({ path });
  }

  console.info(`[${time()}] Closing browser`);
  await browser.close();
})();
