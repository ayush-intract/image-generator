const { default: puppeteer } = require('puppeteer');
const {uploadToGcs} = require('../utility/uploadToGcs.util');
const { preview } = require('vite');
const path = require('path');
const { v4: uuidv4 } = require('uuid');


class HexesImageGenerationService{

    async generateHexesService(data) {
        const count = Math.floor(Math.random() * (500 - 50 + 1)) + 50;
        // Generate all images in parallel

        // const data1 = {
        //     hexBadgeFront: {
        //         difficulty: "EASY",
        //         logo: "https://static.highongrowth.xyz/enterprise/681c5ea9081f4f5d820de280/472dd0625c8d40d18ccb2566c0fec5be.jpg",
        //         project: "Nahi bataunga",
        //         questName: "Hexes bhang bhosda hai iska naam",
        //         type: "ACHIEVEMENT"
        //     },
        //     hexBadgeBack: {
        //         difficulty: 'EASY',
        //         logo: 'https://static.highongrowth.xyz/enterprise/681c5ea9081f4f5d820de280/472dd0625c8d40d18ccb2566c0fec5be.jpg',
        //         project: 'Nahi bataunga',
        //         questName: 'Hexes bhang bhosda hai iska naam',
        //         type: 'ACHIEVEMENT',
        //         userAddress: '0x3BB7044eB37ba9FC5855f5e007Ae423ee2AD19c4',
        //         hexId: '123456',
        //         userId: '123456789',
        //         timeStamp: '12:12:12',
        //         activityType: 'something',
        //     }
        // }

        let publicUrl;
        if(data.hexBadgeFront) {
          const imageBuffer = await this.generateSingleImageFront(data);
          const filename = `hexes2024/${data.cardType}_${uuidv4()}.png`;
          publicUrl = await uploadToGcs(imageBuffer, filename);
        }
        if(data.hexBadgeBack) {
          const imageBuffer = await this.generateSingleImageBack(data);
          const filename = `hexes2024/${data.cardType}_${uuidv4()}.png`;
          publicUrl = await uploadToGcs(imageBuffer, filename);
        }

        return {
            publicUrl,
        }
    }

    async generateSingleImageBack(data) {
      const page = await global.browser.newPage();
      await page.setViewport({ width: 2048, height: 1080 });

      
      try{
        await page.evaluateOnNewDocument((hexBadgeBack) => {
          window.hexBadgeBack = hexBadgeBack;
        }, data.hexBadgeBack);

        let start = Date.now(), start2;
        await page.goto("http://localhost:3001", {
            waitUntil: 'networkidle0',
        })
        console.log('Time taken to load page :: ',Date.now() - start); 

        let snap;
          let start1 = Date.now();
          const cardWrapper = await page.waitForSelector('#hexBadgeMintedBack');
          console.log('Time taken to load card :: ',Date.now() - start1);

          start2 = Date.now();
          snap = await cardWrapper.screenshot({
              type: 'png',
              omitBackground: true,
              scale: 5
          });

        console.log('Time taken to take screenshot :: ',Date.now() - start2);
        return snap;
      }catch(e){
        console.log(e);
      }finally{
        await page.close();
      }

        
    }

    async generateSingleImageFront(data) {
      const page = await global.browser.newPage();
      await page.setViewport({ width: 2048, height: 1080 });

      
      try{
        await page.evaluateOnNewDocument((hexBadgeFront) => {
          window.hexBadgeFront = hexBadgeFront;
        }, data.hexBadgeFront);

        let start = Date.now(), start2;
        await page.goto("http://localhost:3001", {
            waitUntil: 'networkidle0',
        })
        console.log('Time taken to load page :: ',Date.now() - start); 

        let snap;
          let start1 = Date.now();
          const cardWrapper = await page.waitForSelector('#hexBadgeMintedFront');
          console.log('Time taken to load card :: ',Date.now() - start1);

          start2 = Date.now();
          snap = await cardWrapper.screenshot({
              type: 'png',
              omitBackground: true,
              scale: 5
          });

        console.log('Time taken to take screenshot :: ',Date.now() - start2);
        return snap;
      }catch(e){
        console.log(e);
      }finally{
        await page.close();
      }

        
    }

}

const hexesImageGenerationService = new HexesImageGenerationService();


module.exports = hexesImageGenerationService;
