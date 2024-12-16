const puppeteer = require('puppeteer');

const browserCheckMiddleware = async (req, res, next) => {
    try {
        const browser = global.browser;
        
        // Check if browser exists and is connected
        if (!browser || !browser.isConnected()) {
            console.log('Browser is closed or not connected. Launching new browser instance...');
            global.browser = await puppeteer.launch({
                headless: 'new',
                args: ['--no-sandbox']
            });
            console.log('New browser instance created');
        }
        
        next();
    } catch (error) {
        console.error('Error in browser check middleware:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

module.exports = browserCheckMiddleware; 