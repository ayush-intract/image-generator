const puppeteer = require('puppeteer');
const express = require('express');
const {Storage} = require('@google-cloud/storage');
const routes = require('./routes/image-generate.route');
const { preview } = require('vite');
const path = require('path');
const browserCheckMiddleware = require('./middleware/browserCheck.middleware');


if(process.env.NODE_ENV === 'production') {
    require('dotenv').config({ path: '.env.production' });
} else if(process.env.NODE_ENV === 'staging') {
    require('dotenv').config({ path: '.env.staging' });
} else {
    require('dotenv').config({ path: '.env.development' });
}


// Initialize browser on startup
async function initBrowser() {
    browser = await puppeteer.launch({
      headless: 'new',
      args: ['--no-sandbox']
    });
    console.log('Browser instance created');
  }
  
  // Initialize browser before starting the server
  

// const app = express();
const startServer = async () => {
	try {
		console.info('Starting server');
		const app = express();
        // const browser = await initializeBrowser();
        let browser = await puppeteer.launch({
            headless: 'new',
            args: ['--no-sandbox']
        });
        console.log('Browser instance created');

        // Start Vite preview server
        await preview({
            preview: {
                port: 3001,
                open: false
            },
            build: {
                outDir: path.resolve(__dirname, './dist/apps/puppeteer')  // Update this path to where your built files are
            },
            root: path.resolve(__dirname, './dist/apps/puppeteer'),  // Update this path to where your built files are
        });
        
        console.log(`Vite preview server started`);

        global['browser'] = browser;
        // setBrowser(browser);
        app.use(express.json());
        
        // Add the browser check middleware before the routes
        app.use(browserCheckMiddleware);
        
        app.use('/api/igv1',routes)
        app.listen(process.env.NODE_PORT, () => {
            console.info(`
                ################################################
                🛡️  Server listening on port: ${process.env.NODE_PORT} 🛡️
                ################################################
            `);
        });
		
	} catch (err) {
		console.error('Server startup error:', err);
	}
};

// async function initializeBrowser() {
//     browser = await puppeteer.launch({
//         headless: 'new',
//         args: ['--no-sandbox']
//     });
//     console.log('Browser instance created');

//     return browser
// }

process.on('SIGINT', async () => {
    console.log('Caught SIGINT signal');
    if (global.browser) {
        await global.browser.close();
        console.log('Browser closed');
    }
    process.exit();
});

process.on('uncaughtException', function (err) {
	console.error(err);
	console.error('exception');
});

startServer();


// module.exports = { browser };