const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch();
  const page    = await browser.newPage();

  await page.setViewport({ width: 1280, height: 900, deviceScaleFactor: 2 });
  await page.goto('http://localhost:8080', { waitUntil: 'networkidle0', timeout: 30000 });

  // Chờ font load xong
  await page.evaluateHandle('document.fonts.ready');

  // Lấy chiều cao thực của trang để không bị cắt
  const height = await page.evaluate(() => document.body.scrollHeight);

  const pdf = await page.pdf({
    path:            'cv.pdf',
    printBackground: true,
    width:           '1280px',
    height:          `${height}px`,
    margin:          { top: '0', right: '0', bottom: '0', left: '0' },
  });

  await browser.close();
  console.log('Xong: cv.pdf');
})();
