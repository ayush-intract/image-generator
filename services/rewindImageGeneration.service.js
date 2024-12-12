
const templates = {
    degenStats: (count) => ({
      gradient: 'linear-gradient(135deg, #ff8a00, #ff4e00)',
      title: '🔥 DEGEN STATS 2024',
      subtitle: 'Crushing It With Style',
      metric: `${count.toLocaleString()}`,
      metricLabel: 'Total Transactions'
    }),
    
    whaleWatch: (count) => ({
      gradient: 'linear-gradient(135deg, #3498db, #2980b9)',
      title: '🐋 WHALE WATCH 2024',
      subtitle: 'Big Moves Only',
      metric: `$${(count * 1000).toLocaleString()}`,
      metricLabel: 'Volume Traded'
    }),
    
    nftMaster: (count) => ({
      gradient: 'linear-gradient(135deg, #9b59b6, #8e44ad)',
      title: '🎨 NFT MASTER 2024',
      subtitle: 'Digital Art Kingdom',
      metric: `${(count * 2).toLocaleString()}`,
      metricLabel: 'NFTs Minted'
    }),
    
    stakingChad: (count) => ({
      gradient: 'linear-gradient(135deg, #2ecc71, #27ae60)',
      title: '💎 STAKING CHAD 2024',
      subtitle: 'Diamond Hands Forever',
      metric: `${(count * 5).toLocaleString()} ETH`,
      metricLabel: 'Total Staked'
    }),
    
    gasGuru: (count) => ({
      gradient: 'linear-gradient(135deg, #e74c3c, #c0392b)',
      title: '⛽ GAS GURU 2024',
      subtitle: 'Optimizing Every Wei',
      metric: `${(count * 0.01).toFixed(2)} ETH`,
      metricLabel: 'Gas Saved'
    }),
    
    communityKing: (count) => ({
      gradient: 'linear-gradient(135deg, #f1c40f, #f39c12)',
      title: '👑 COMMUNITY KING 2024',
      subtitle: 'Building The Future Together',
      metric: `${(count * 10).toLocaleString()}`,
      metricLabel: 'Community Members'
    })
};


const { default: puppeteer } = require('puppeteer');
const {uploadToGcs} = require('../utility/uploadToGcs.util');
const { preview } = require('vite');
const path = require('path');
// import {uploadToGCS} from '../utility/uploadToGcs.util'
// const {getBrowser} = require('../server')
// const puppeteer = require('puppeteer');
// const browser = await puppeteer.launch({
//     headless: 'new',
//     args: ['--no-sandbox']
// });
// console.log('Browser instance created');

class RewindImageGenerationSerice{

    async generateRewindService(data) {
        const count = Math.floor(Math.random() * (500 - 50 + 1)) + 50;
        // Generate all images in parallel
        const imageBuffer = await this.generateSingleImage(data);
        const filename = `rewind2024/${'templateName'}_${Date.now()}.png`;
        const publicUrl = await uploadToGcs(imageBuffer, filename);
        return {
            publicUrl
        }
        // const imagePromises = Object.entries(templates).map(async ([templateName, templateFn]) => {
        //     const template = templateFn(count);
        //     const html = this.generateHTML(template);
        //     const imageBuffer = await this.generateSingleImage(html, templateName);
        //     const filename = `rewind2024/${templateName}_${Date.now()}.png`;
        //     const publicUrl = await uploadToGcs(imageBuffer, filename);
        //     return { templateName, publicUrl };
        // });
    
        // const results = await Promise.all(imagePromises);
        // return results;
    }

    async generateSingleImage(data) {
        // const browser = getBrowser;

        const previewServer = await preview({
            preview: {
                port: 3001,
                open: false
            },
            build: {
                outDir: path.resolve(__dirname, '../../wallet-infra/dist/apps/puppeteer')
            },
            root: path.resolve(__dirname, '../../wallet-infra/dist/apps/puppeteer'),
        })

        const browser = await puppeteer.launch();
        const page = await browser.newPage();
        
        await page.evaluateOnNewDocument(() => {
          window._asmMetricType = 'TotalGasSaved',
          window._asmMetricData = {
            "totalGasSaved": 1112,
            "randomText": data,
          }
        })

        await page.goto("http://localhost:3001", {
            waitUntil: 'networkidle0',
        })

        await page.evaluate(() => {
             if(window.React && window.React.version) {
                console.log("React is loaded", window.React);
             }
        })
     
        const card = await page.waitForSelector('#contrast');
        const snap = await card.screenshot({ path: "a.png", omitBackground: true });
        return snap;
        

        // await browser.close();
        // await new Promise(resolve => previewServer.httpServer.close(resolve));
        
    }

    generateHTML(template) {
        return `
          <div style="
            width: 500px; 
            height: 700px; 
            padding: 30px; 
            border-radius: 12px; 
            box-shadow: 0 2px 4px rgba(0,0,0,0.1); 
            background: ${template.gradient};
            box-sizing: border-box;
            display: flex;
            flex-direction: column;
            justify-content: space-between;
            align-items: center;
            text-align: center;
            color: white;
          ">
            <h2 style="
              margin: 0; 
              font-size: 42px;
              text-shadow: 2px 2px 4px rgba(0,0,0,0.3);
              letter-spacing: 1px;
            ">${template.title}</h2>
            <p style="
              font-size: 24px;
              margin: 15px 0;
              opacity: 0.9;
              text-shadow: 1px 1px 2px rgba(0,0,0,0.2);
            ">${template.subtitle}</p>
            <p style="
              font-size: 38px;
              margin-top: 30px;
              font-weight: bold;
              text-shadow: 2px 2px 4px rgba(0,0,0,0.3);
            ">
              ${template.metric}
              <span style="display: block; font-size: 28px;">${template.metricLabel}</span>
            </p>
          </div>
        `;
    }

}

const rewindImageGenerationService = new RewindImageGenerationSerice();


module.exports = rewindImageGenerationService;





