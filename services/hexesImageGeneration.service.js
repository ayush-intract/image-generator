// const { default: puppeteer } = require('puppeteer');
const {uploadToGcs, uploadMetadataToGcs} = require('../utility/uploadToGcs.util');
// const { preview } = require('vite');
// const path = require('path');
// const { v4: uuidv4 } = require('uuid');


class HexesImageGenerationService{

    async generateHexesService(data) {
        const count = Math.floor(Math.random() * (500 - 50 + 1)) + 50;
        // Generate all images in parallel

        let publicUrl, metaDataUrl;
        if(data.hexBadgeFront) {
          const imageBuffer = await this.generateSingleImageFront(data);
          // const filename = `hexes2024/${data.projectName}_${uuid}.png`;
          const filename = data?.hexBadgeFront?.filePath;
          publicUrl = await uploadToGcs(imageBuffer, filename);
        }
        if(data.hexBadgeBack) {
          const imageBuffer = await this.generateSingleImageBack(data);
          // const filename = `hexes2024/${data.hexId}_${data.userId}_${uuid}.png`;
          const filename = data?.hexBadgeBack?.filePath;
          publicUrl = await uploadToGcs(imageBuffer, filename);
        }

        if(data.hexBadgeTwitterShare) {
          const imageBuffer = await this.generateSingleImageTwitterShare(data);
          // const filename = `hexes2024/${data.projectName}_${uuid}.png`;
          const filename = data?.hexBadgeTwitterShare?.filePath;
          publicUrl = await uploadToGcs(imageBuffer, filename);
        }

        if(data.nftMeta) {
          // const fileName = `hexes2024/${data.hexId}_${data.userId}_${uuid}`;
          const fileName = data?.nftMeta?.filePath;
          const metadata = await uploadMetadataToGcs(data.nftMeta, fileName);
          metaDataUrl = metadata;
        }

        return {
            publicUrl,
            metaDataUrl
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

    async generateSingleImageTwitterShare(data) {
      const page = await global.browser.newPage();
      await page.setViewport({ width: 2048, height: 1080 });

      try{
        await page.evaluateOnNewDocument((hexBadgeTwitterShare) => {
          window.hexBadgeTwitterShare = hexBadgeTwitterShare;
        }, data.hexBadgeTwitterShare);

        let start = Date.now(), start2;
        await page.goto("http://localhost:3001", {
            waitUntil: 'networkidle0',
        })
        console.log('Time taken to load page :: ',Date.now() - start); 

        let snap;
          let start1 = Date.now();
          const cardWrapper = await page.waitForSelector('#hexBadgeTwitterShare');
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
