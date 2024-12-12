const puppeteer = require('puppeteer');
const express = require('express');
const {Storage} = require('@google-cloud/storage');
require('dotenv').config({ path: '.env.dev' });
const routes = require('./routes/image-generate.route');
const { preview } = require('vite');
const path = require('path');


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

        // const previewServer = await preview({
        //     preview: {
        //         port: 3001,
        //         open: false
        //     },
        //     build: {
        //         outDir: path.resolve(__dirname, '../wallet-infra/dist/apps/puppeteer')
        //     },
        //     root: path.resolve(__dirname, '../wallet-infra/dist/apps/puppeteer'),
        // })

        global['browser'] = browser;
        // setBrowser(browser);
        app.use(express.json());
        app.use(routes)
        
		app.listen(process.env.NODE_PORT, () => {
			console.info(`
                ################################################
                🛡️  Server listening on port: ${process.env.NODE_PORT} 🛡️
                ################################################
            `);
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