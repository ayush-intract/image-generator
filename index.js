const puppeteer = require('puppeteer');
const express = require('express');
const {Storage} = require('@google-cloud/storage');
const app = express();

app.use(express.json());

// Initialize GCP Storage
const storage = new Storage({
  keyFilename: 'cloud.json',
  projectId: 'intract-cloud'
});
const bucketName = 'static.highongrowth.xyz';
const bucket = storage.bucket(bucketName);

// Global browser instance
let browser;

// Template generators
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

function generateHTML(template) {
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

async function generateSingleImage(html, templateName) {
  const page = await browser.newPage();
  try {
    await page.setViewport({
      width: 500,
      height: 700
    });
    await page.setContent(html);
    const element = await page.$('body');
    const screenshot = await element.screenshot({
      type: 'png'
    });
    return screenshot;
  } finally {
    await page.close();
  }
}

async function generateTweetImage(tweetUrl) {
  const page = await browser.newPage(headless=false);
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
    
    return screenshot;
  } catch (error) {
    console.error('Error generating tweet image:', error);
    return null;
  } finally {
    await page.close();
  }
}

async function uploadToGCS(buffer, filename) {
  const file = bucket.file(filename);
  await file.save(buffer, {
    contentType: 'image/png'
  });
  return file.publicUrl();
}

app.post('/generate', async (req, res) => {
  try {
    // const count = Math.floor(Math.random() * (500 - 50 + 1)) + 50;
    
    // Generate all images in parallel
    const count = Math.floor(Math.random() * (500 - 50 + 1)) + 50;

    // Generate all images in parallel
    const imagePromises = Object.entries(templates).map(async ([templateName, templateFn]) => {
      const template = templateFn(count);
      const html = generateHTML(template);
      const imageBuffer = await generateSingleImage(html, templateName);
      const filename = `rewind2024/${templateName}_${Date.now()}.png`;
      const publicUrl = await uploadToGCS(imageBuffer, filename);
      return { templateName, publicUrl };
    });

    const results = await Promise.all(imagePromises);
    
    res.json({
      success: true,
      images: results
    });
  } catch (error) {
    console.error('Error generating images:', error);
    res.status(500).json({ error: error.message });
  }
});


app.post('/tweet-generate', async (req, res) => {
  try {
    console.log(req.body);
    const tweetUrl = req.body.tweetUrl;
    if(!tweetUrl) {
      return res.status(200).json({ error: 'Tweet URL is required' });
    }
    const imageBuffer = await generateTweetImage( tweetUrl);
    const filename = `dailyDrop2024/tweet_create_${Date.now()}.png`;
    const publicUrl = await uploadToGCS(imageBuffer, filename);
    res.json({
      success: true,
      image: {
        url: publicUrl
      }
    });
  } catch (error) {
    console.error('Error generating images:', error);
    res.status(500).json({ error: error.message });
  }
});


// Initialize browser on startup
async function initBrowser() {
  browser = await puppeteer.launch({
    headless: 'new',
    args: ['--no-sandbox']
  });
  console.log('Browser instance created');
}

// Initialize browser before starting the server
initBrowser()
  .then(() => {
    app.listen(3000, () => console.log('Server running on port 3000'));
  })
  .catch(err => {
    console.error('Failed to initialize browser:', err);
    process.exit(1);
  });

// Cleanup on server shutdown
process.on('SIGINT', async () => {
  if (browser) {
    await browser.close();
  }
  process.exit();
});