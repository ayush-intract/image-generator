const puppeteer = require('puppeteer');
const express = require('express');
const {Storage} = require('@google-cloud/storage');
const routes = require('./routes/image-generate.route');


if(process.env.NODE_ENV === 'production') {
    require('dotenv').config({ path: '.env.production' });
} else if(process.env.NODE_ENV === 'staging') {
    require('dotenv').config({ path: '.env.staging' });
} else {
    require('dotenv').config({ path: '.env.development' });
}

// let browserInstance = null;
// let browser;

// const getBrowser = () => {return browserInstance;}
// const setBrowser = (browser) => {
//     if(!browserInstance) {
//         browserInstance = browser;
//     }
//     return browserInstance;
//     // browserInstance = browser;
// };
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
        global['browser'] = browser;
        // setBrowser(browser);
        app.use(express.json());
        app.use('/api/igv1',routes)
        initBrowser()
        .then(() => {
            app.listen(process.env.NODE_PORT, () => {
                console.info(`
                    ################################################
                    🛡️  Server listening on port: ${process.env.NODE_PORT} 🛡️
                    ################################################
                `);
            });
        })
        .catch(err => {
            console.error('Failed to initialize browser:', err);
        process.exit(1);
        });
		
	} catch (err) {
		console.error(err);
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
    process.exit();
});

process.on('uncaughtException', function (err) {
	console.error(err);
	console.error('exception');
});

startServer();


// module.exports = { browser };