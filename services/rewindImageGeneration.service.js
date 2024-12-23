const { default: puppeteer } = require('puppeteer');
const {uploadToGcs} = require('../utility/uploadToGcs.util');
const { preview } = require('vite');
const path = require('path');
const { v4: uuidv4 } = require('uuid');


class RewindImageGenerationSerice{

    async generateRewindService(data) {
        const count = Math.floor(Math.random() * (500 - 50 + 1)) + 50;
        // Generate all images in parallel

        const imageBuffer = await this.generateSingleImage(data, false);
        const filename = `rewind2024/${data.cardType}_${uuidv4()}.png`;
        const publicUrl = await uploadToGcs(imageBuffer, filename);

        let profileImageLink;
        if(data.cardType === 'NftMint' || data.cardType === 'NftCardMetric') {
            const imageBuffer = await this.generateSingleImage(data, true);
            const filename = `rewind2024/${data.cardType}_${uuidv4()}.png`;
            profileImageLink = await uploadToGcs(imageBuffer, filename);
        }

        return {
            publicUrl,
            profileImageLink
        }
    }

    async generateSingleImage(data, generateProfileLink = false) {
      // const browser = getBrowser;
      const page = await global.browser.newPage();
      await page.setViewport({ width: 2048, height: 1080 });

      
      try{
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

        if(generateProfileLink) {
          let start1 = Date.now();
          const card = await page.waitForSelector('#contrast');
          console.log('Time taken to load card :: ',Date.now() - start1);

          start2 = Date.now();
          snap = await card.screenshot({
                type: 'png',
                omitBackground: true,
                scale: 5
            });
          
        } else {
          let start1 = Date.now();
          const cardWrapper = await page.waitForSelector('#contrast-wrapper');
          console.log('Time taken to load card :: ',Date.now() - start1);

          start2 = Date.now();
          snap = await cardWrapper.screenshot({
              type: 'png',
              omitBackground: true,
              scale: 5
          });
        }
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

const rewindImageGenerationService = new RewindImageGenerationSerice();


module.exports = rewindImageGenerationService;