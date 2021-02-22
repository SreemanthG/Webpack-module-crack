import * as puppeteer from 'puppeteer';
import Inject from './inject'
// const web = new Inject()
// console.log(web.getAllStates);


(async () => {
  const browser = await puppeteer.launch({ headless: false });
  const page = await browser.newPage();
  await page.goto('https://web.whatsapp.com/');
  // Get the "viewport" of the page, as reported by the page.
  // const dimensions = await page.evaluate(exportInject);
  await page.waitForTimeout(10000)
  // await page.addScriptTag({ path: './build/src/inject.js' });
  // await page.exposeFunction("inject",()=>{
  //   return Inject;
  // })
  const dimensions = await page.evaluate((temp)=>{
    // const webObj = new window.inject();
    eval('var inject = new '+ temp);
    window.inject = inject;
  },Inject.toString());

  console.log('Dimensions:', dimensions);

  // await browser.close();
})();
