const puppeteer = require('puppeteer');
const iPad = puppeteer.devices['iPad'];
const iPadLand = puppeteer.devices['iPad landscape'];
const iPhone7 = puppeteer.devices['iPhone 7'];
const iPhone7Land = puppeteer.devices['iPhone 7 landscape'];

const targetPath = 'automation/screentest/';
const targetUrl = 'http://localhost:3000/';
// const targetUrl = 'chrome://gpu'; // chrome://gpu

process.env.PUPPETEER_SKIP_CHROMIUM_DOWNLOAD = 'true';

// function delay(time) {
//   return new Promise(function(resolve) {
//     setTimeout(resolve, time)
//   });
// }

// 'iPad'
// 'iPad landscape'
//
// 'iPad Mini'
// 'iPad Mini landscape'
//
// 'iPad Pro'
// 'iPad Pro landscape'
//
// 'iPhone 7'
// 'iPhone 7 landscape'
//
// 'iPhone 7 Plus'
// 'iPhone 7 Plus landscape'
//
// 'iPhone X'
// 'iPhone X landscape'
//
// 'Pixel 2'
// 'Pixel 2 landscape'

// args: [
//   // '--info', // doesn't pipe
//   // '--verbose', // doesn't pipe
//   // '--enable-webgl',
// ]

(async() => {
  const browser = await puppeteer.launch({ headless: false, defaultViewport: {
      width: 1280,
      height: 720,
    }});

  // console.log(puppeteer.defaultArgs());
  const page = await browser.newPage();
  await page.goto(targetUrl, { waitUntil: ['domcontentloaded', 'networkidle0'] });
  await page.screenshot({path: targetPath + 'desktop.png'});
  await page.emulate(iPhone7);
  await page.screenshot({path: targetPath + 'iPhone7.png'});
  await page.emulate(iPhone7Land);
  await page.screenshot({path: targetPath + 'iPhone7Land.png'});
  await page.emulate(iPad);
  await page.screenshot({path: targetPath + 'iPad.png'});
  await page.emulate(iPadLand);
  await page.screenshot({path: targetPath + 'iPadLand.png'});
  await browser.close();
})();