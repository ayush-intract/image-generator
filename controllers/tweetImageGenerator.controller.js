
const tweetImageGenerationService = require('../services/tweetImageGeneration.service');
const { uploadToGcs } = require('../utility/uploadToGcs.util')


class TweetImageGenerator {
    async generatorTweetImage(req, res) {
        try {
            const tweetUrl = req.body?.tweetUrl;
            if(!tweetUrl) {
              return res.status(200).json({ error: 'Tweet URL is required' });
            }
            const imageBuffer = await tweetImageGenerationService.generateTweetImageService( tweetUrl);
            const filename = `dailyDrop/tweet_create_${Date.now()}.png`;
            const publicUrl = await uploadToGcs(imageBuffer, filename); 
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
    }
}

const tweetImageGeneratorInstance = new TweetImageGenerator();

module.exports = {
    tweetImageGeneratorInstance
}


