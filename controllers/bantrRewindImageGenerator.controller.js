const { BantrRewindImageTypeEnum } = require('../definitions/index.js');
const bantrRewindImageGenerationService = require('../services/bantrRewindImageGeneration.service');

class BantrRewindImageGenerator {
    async generatorImage(req, res) {
        try {
            const stats = req.body;
            let a = Date.now();
            // Collect promises for parallel execution
            const promises = [];
            for (let i = 0; i < stats.length; i++) {

                const stat = stats[i];

                if(typeof stat !== 'object') continue;

                const { metricData, metricType, theme } = stat;

                if(BantrRewindImageTypeEnum[metricType]){
                    let stat = {
                        "cardType": metricType,
                        "cardData": metricData,
                        "cardTheme": theme || "base",
                    }
                    // Push the promise to the array
                    promises.push(bantrRewindImageGenerationService.generateRewindService(stat).then(r => {
                        return { metricType, cardUrl:  r.publicUrl.replace('%2F', '/').replace('storage.googleapis.com/static.highongrowth.xyz', 'static.highongrowth.xyz') };
                    }));
                }
            }
            // Wait for all promises to resolve
            const response = await Promise.all(promises);
            console.log('response time :: ',Date.now() - a);

            console.log("response :: ", JSON.stringify(response));
            res.json({
                success: true,
                images: response
            });
        } catch (error) {
            console.error('Error generating images:', error);
            res.status(500).json({ error: error.message });
        }
    }
}

const bantrRewindImageGeneratorInstance = new BantrRewindImageGenerator();

module.exports = {
    bantrRewindImageGeneratorInstance
}


