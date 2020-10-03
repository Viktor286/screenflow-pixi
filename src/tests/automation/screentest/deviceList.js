const puppeteer = require('puppeteer');

const desktopDevice = {
  name: 'laptop',
  userAgent:
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/85.0.4183.83 Safari/537.36',
  viewport: {
    width: 1440,
    height: 900,
    deviceScaleFactor: 1,
    isMobile: false,
    hasTouch: false,
    isLandscape: false,
  },
};

module.exports = [
  desktopDevice,
  puppeteer.devices['iPad'],
  puppeteer.devices['iPad landscape'],
  puppeteer.devices['iPhone 7'],
  puppeteer.devices['iPhone 7 landscape'],
];

// Some of puppeteer device options
// node_modules\puppeteer\lib\cjs\puppeteer\common\DeviceDescriptors.js

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
