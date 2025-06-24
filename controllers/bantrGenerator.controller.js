// const rewindImageGenerationService = require('../services/rewindImageGeneration.service');
const bantrImageGenerationService  = require('../services/bantrImageGeneration.service');

class BantrImageGenerator {
    async generatorBantrImage(req, res) {
        try {
            const stat = req.body;
            let a = Date.now();
            const promises = [];
            promises.push(bantrImageGenerationService.generateBantrService(stat, stat.templateType, stat.imageSelector).then(r => {
                return { cardUrl:  r.publicUrl.replace('%2F', '/').replace('storage.googleapis.com/static.highongrowth.xyz', 'static.highongrowth.xyz') };
            }));
            const response = await Promise.all(promises);
            console.log('response time :: ',Date.now() - a);
            
            res.json({
                success: true,
                images: response?.length > 0 ? response[0] : {}
            });
        } catch (error) {
            console.error('Error generating images:', error);
            res.status(500).json({ error: error.message });
        }
    }
}

const bantrImageGeneratorInstance = new BantrImageGenerator();

module.exports = {
    bantrImageGeneratorInstance
}


