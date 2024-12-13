const { default: puppeteer } = require('puppeteer');
const {uploadToGcs} = require('../utility/uploadToGcs.util');
const { preview } = require('vite');
const path = require('path');
const { v4: uuidv4 } = require('uuid');


class RewindImageGenerationSerice{

    async generateRewindService(data) {
        const count = Math.floor(Math.random() * (500 - 50 + 1)) + 50;
        // Generate all images in parallel

        const imageBuffer = await this.generateSingleImage(data);
        const filename = `rewind2024/${data.cardType}_${uuidv4()}.png`;
        const publicUrl = await uploadToGcs(imageBuffer, filename);
        return {
            publicUrl
        }
    }

    async generateSingleImage(data) {
      // const browser = getBrowser;
      const page = await global.browser.newPage();
      // await page.setViewport({ width: 360, height: 600 });

      
      try{
        await page.evaluateOnNewDocument((cardType, cardData) => {
          window._asmMetricType = cardType;
          window._asmMetricData = cardData;
        }, data.cardType, data.cardData);

        let start = Date.now();
        await page.goto("http://localhost:3001", {
            waitUntil: 'networkidle0',
        })
        console.log('Time taken to load page :: ',Date.now() - start); 
        let start1 = Date.now();
        const card = await page.waitForSelector('#contrast');
        console.log('Time taken to load card :: ',Date.now() - start1);
        let start2 = Date.now();
        // const snap = await card.screenshot({ path: "a.png", omitBackground: true });
        //snapsjot make it less quality

        const snap = await card.screenshot({type: 'jpeg', quality: 100});
        console.log('Time taken to take screenshot :: ',Date.now() - start2);
        return snap;
      }catch(e){
        console.log(e);
      }finally{
        await page.close();
      }

        
    }

}

const rewindImageGenerationService = new RewindImageGenerationSerice();


module.exports = rewindImageGenerationService;