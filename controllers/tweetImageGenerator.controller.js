
const tweetImageGenerationService = require('../services/tweetImageGeneration.service');
const { uploadToGcs } = require('../utility/uploadToGcs.util')


class TweetImageGenerator {
    async generatorTweetImage(req, res) {
        try {
            const tweetUrl = req.body?.tweetUrl;
            if(!tweetUrl) {
              return res.status(400).json({ error: 'Tweet URL is required' });
            }
            const result = await tweetImageGenerationService.generateTweetImageService( tweetUrl);
            const filename = `dailyDrop/tweet_create_${Date.now()}.png`;
            let publicUrl = await uploadToGcs(result.imageBuffer, filename); 
            publicUrl= publicUrl.replace('%2F', '/')
            res.json({
              success: true,
              image: {
                url: publicUrl,
                height: result.height,
                width: result.width
              }
            });
          } catch (error) {
            console.error('Error generating images:', error);
            res.status(500).json({ error: error.message });
          }
    }
}

const tweetImageGeneratorInstance = new TweetImageGenerator();

module.exports = {
    tweetImageGeneratorInstance
}


