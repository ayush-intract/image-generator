const { default: puppeteer } = require('puppeteer');
const {uploadToGcs} = require('../utility/uploadToGcs.util');
const { preview } = require('vite');
const path = require('path');
const { v4: uuidv4 } = require('uuid');


class BantrRewindImageGenerationSerice{

    async generateRewindService(data) {
        // Generate all images in parallel

        // console.log('Data INPUT :: ',JSON.stringify(data));
        const imageBuffer = await this.generateSingleImage(data);
        const filename = `rewindBantr2024/${data.cardType}_${uuidv4()}.png`;
        const publicUrl = await uploadToGcs(imageBuffer, filename);

        console.log("DEBUG publicUrl :: ", publicUrl);
        return {
            publicUrl,
        }
    }

    async generateSingleImage(data) {
      // const browser = getBrowser;
      const page = await global.browser.newPage();
      await page.setViewport({ width: 2048, height: 1080 });

      try{
        console.log("DEBUG :: ", data.cardType, data.cardData, data.cardTheme);
        await page.evaluateOnNewDocument((cardType, cardData, cardTheme) => {
          window._asmMetricType = cardType;
          window._asmMetricData = cardData;
          window._asmTheme = cardTheme;
        }, data.cardType, data.cardData, data.cardTheme);

        let start = Date.now(), start2;
        await page.goto("http://localhost:3001", {
            waitUntil: 'networkidle0',
        })
        console.log('Time taken to load page :: ',Date.now() - start); 
        // const snap = await card.screenshot({ path: "a.png", omitBackground: true });
        //snapsjot make it less quality

        let snap;

      
          let start1 = Date.now();
          const cardWrapper = await page.waitForSelector('#bantr-rewind-card');
          console.log('Time taken to load card :: ',Date.now() - start1);

          start2 = Date.now();
          snap = await cardWrapper.screenshot({
              type: 'png',
              omitBackground: true,
              scale: 5
          });
        
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

}

const bantrRewindImageGenerationService = new BantrRewindImageGenerationSerice();


module.exports = bantrRewindImageGenerationService;