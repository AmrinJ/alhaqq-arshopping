const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  
  page.on('pageerror', e => console.log('REACT ERROR:', e.message));
  page.on('console', msg => {
    if (msg.type() === 'error') console.log('CONSOLE ERROR:', msg.text());
  });

  await page.goto('http://localhost:5173/product/43', { waitUntil: 'networkidle0' });
  console.log('Page loaded');
  
  // Login hack
  await page.evaluate(() => {
    window.localStorage.setItem('user', JSON.stringify({ token: 'fake', user_name: 'test' }));
  });
  await page.reload({ waitUntil: 'networkidle0' });
  console.log('Reloaded with user');
  
  // Click Buy Now
  await page.evaluate(() => {
    const btns = Array.from(document.querySelectorAll('button'));
    const buybtn = btns.find(b => b.innerText.includes('BUY NOW'));
    if(buybtn) buybtn.click();
  });
  console.log('Clicked Buy Now');
  await new Promise(r => setTimeout(r, 500));
  
  // Select COD
  await page.evaluate(() => {
    const radios = document.querySelectorAll('input[type=radio]');
    if(radios.length > 0) radios[radios.length-1].click();
  });
  console.log('Selected payment');
  
  // Click pay
  await page.evaluate(() => {
    const btns = Array.from(document.querySelectorAll('button'));
    const paybtn = btns.find(b => b.innerText.includes('CONFIRM') || b.innerText.includes('PAY'));
    if(paybtn) paybtn.click();
  });
  console.log('Clicked Pay... waiting 3 seconds');
  await new Promise(r => setTimeout(r, 3000));
  console.log('Done waiting. Checking for success screen');
  
  // Screenshot the result
  await page.screenshot({ path: 'test_checkout.png' });
  await browser.close();
})();
