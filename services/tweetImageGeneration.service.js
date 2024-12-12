


// import {uploadToGCS} from '../utility/uploadToGcs.util'
// const {getBrowser} = require('../server')
// const puppeteer = require('puppeteer');
// const browser = await puppeteer.launch({
//     headless: 'new',
//     args: ['--no-sandbox']
// });
// console.log('Browser instance created');

class RewindImageGenerationSerice{

    async generateTweetImageService(tweetUrl) {
        const page = await global.browser.newPage();
        try {
            await page.goto(tweetUrl, {waitUntil: 'networkidle0'});

            await page.setViewport({width: 1080, height: 1024});
            // console.log(window.document.body.innerHTML);
            const imageSize= await page.evaluate(() => {
                return {
                    width: window.document.body.clientWidth ,
                    height: window.document.body.clientHeight
                };
            });

            await page.setViewport({width: imageSize.width, height: imageSize.height});

            const screenshot = await page.screenshot({ type: 'png', clip: { x: 0, y: 0, width: imageSize.width/2+5, height: imageSize.height-90 } });
            
            return {'imageBuffer':screenshot,'width': imageSize.width/2+5, 'height': imageSize.height-90};
        } catch (error) {
            console.error('Error generating tweet image:', error);
            return null;
        } finally {
            await page.close();
        }
    }
   

}

const rewindImageGenerationService = new RewindImageGenerationSerice();


module.exports = rewindImageGenerationService;





