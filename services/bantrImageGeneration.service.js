const { default: puppeteer } = require('puppeteer');
const {uploadToGcs} = require('../utility/uploadToGcs.util');
const { preview } = require('vite');
const path = require('path');
const { v4: uuidv4 } = require('uuid');
const fs = require('fs');
const Mustache = require('mustache');


class BantrImageGenerationSerice{

    async generateBantrService(data, templateType, imageSelector) {
        // const count = Math.floor(Math.random() * (500 - 50 + 1)) + 50;

        // const imageBuffer = await this.generateScreenshotFromHtml(data, false);
        // const imageBuffer = await this.testMoutache();
        const imageBuffer = await this.generateSingleImage(data, templateType, imageSelector);
        
        const filename = `bantr/${data.cardType}_${uuidv4()}.png`;
        const publicUrl = await uploadToGcs(imageBuffer, filename);

        // let profileImageLink;
        // if(data.cardType === 'NftMint' || data.cardType === 'NftCardMetric') {
        //     const imageBuffer = await this.generateSingleImage(data, true);
        //     const filename = `rewind2024/${data.cardType}_${uuidv4()}.png`;
        //     profileImageLink = await uploadToGcs(imageBuffer, filename);
        // }

        console.log("publicUrl :: ",publicUrl);
        return {
            publicUrl,
            // profileImageLink
        }
    }

    async generateSingleImage(data, templateType, imageSelector) {
      // const browser = getBrowser;
      const page = await global.browser.newPage();
      await page.setViewport({ width: 2048, height: 1080 });

      console.log('data :: ',JSON.stringify(data));
      console.log('imageSelector :: ',imageSelector);
      console.log('templateType :: ',templateType);
      try{
        // await page.evaluateOnNewDocument((cardType, cardData, cardTheme) => {
        //   window._asmMetricType = cardType;
        //   window._asmMetricData = cardData;
        //   window._asmTheme = cardTheme;
        // }, data.cardType, data.cardData, data.cardTheme);

        await page.evaluateOnNewDocument((data, templateType) => {
          window[`${templateType}`] = data
        }, data, templateType);

        let start = Date.now(), start2;
        await page.goto("http://localhost:3001", {
            waitUntil: 'networkidle0',
        })
        console.log('Time taken to load page :: ',Date.now() - start); 
        // const snap = await card.screenshot({ path: "a.png", omitBackground: true });
        //snapsjot make it less quality

        let snap;

        // if(generateProfileLink) {
          let start1 = Date.now();
          const card = await page.waitForSelector(imageSelector);
          console.log('Time taken to load card :: ',Date.now() - start1);

          start2 = Date.now();
          snap = await card.screenshot({
                type: 'png',
                omitBackground: true,
                // scale: 5
            });
          
        // } 
        // else {
        //   let start1 = Date.now();
        //   const cardWrapper = await page.waitForSelector('#contrast-wrapper');
        //   console.log('Time taken to load card :: ',Date.now() - start1);

        //   start2 = Date.now();
        //   snap = await cardWrapper.screenshot({
        //       type: 'png',
        //       omitBackground: true,
        //       scale: 5
        //   });
        // }
        // snap = await cardWrapper.screenshot({
        //     type: 'png',
        //     omitBackground: true,
        //     scale: 5
        // });

        console.log('Time taken to take screenshot :: ',Date.now() - start2);
        return snap;
      }catch(e){
        console.log(e);
      }finally{
        await page.close();
      }

        
    }

    /**
     * Opens ./output.html, takes a screenshot, and returns the screenshot buffer.
     * This method is similar to generateSingleImage but works with a local HTML file.
     * @returns {Buffer|null} PNG image buffer or null if error
     */
    async generateScreenshotFromHtml() {
      const page = await global.browser.newPage();
      await page.setViewport({ width: 1200, height: 628 });
      try {
        // Use file:// protocol to open local HTML file
        const st = Date.now();
        const filePath = path.resolve(__dirname, './output.html');
        await page.goto(`file://${filePath}`);
        await page.waitForSelector('#rizz-score');

        const et = Date.now();
        console.log("Time taken to load page :: ",et - st);
        // Take a screenshot of the full page

        const st2 = Date.now();
        const snap = await page.screenshot({
          type: 'png',
          
        //   omitBackground: true,
        //   fullPage: true
        });
        const et2 = Date.now();
        console.log("Time taken to take screenshot :: ",et2 - st2);
        return snap;
      } catch (e) {
        console.log(e);
        return null;
      } finally {
        await page.close();
      }
    }

    async testMoutache() {
        const page = await global.browser.newPage();
        await page.setViewport({ width: 1200, height: 628 });
        const filePath = path.resolve(__dirname, './output.html');
        const template = fs.readFileSync(filePath, 'utf8');
        const html = Mustache.render(template, {
          title: 'Hello World'
        });
      
        await page.setContent(html, { waitUntil: 'domcontentloaded' });
        const snap = await page.screenshot({ path: 'output.png' });

        return snap
    }

}

const bantrImageGenerationService = new BantrImageGenerationSerice();


module.exports = bantrImageGenerationService;