
const rewindImageGenerationService = require('../services/rewindImageGeneration.service');

class ImageGenerator {
    async generatorImage(req, res) {
        try {

            const response = await rewindImageGenerationService.generateRewindService();
            // const count = Math.floor(Math.random() * (500 - 50 + 1)) + 50;
            // // Generate all images in parallel
            // const imagePromises = Object.entries(templates).map(async ([templateName, templateFn]) => {
            //     const template = templateFn(count);
            //     const html = generateHTML(template);
            //     const imageBuffer = await generateSingleImage(html, templateName);
            //     const filename = `rewind2024/${templateName}_${Date.now()}.png`;
            //     const publicUrl = await uploadToGCS(imageBuffer, filename);
            //     return { templateName, publicUrl };
            // });
        
            // const results = await Promise.all(imagePromises);
            
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

const imageGeneratorInstance = new ImageGenerator();

module.exports = {
    imageGeneratorInstance
}


