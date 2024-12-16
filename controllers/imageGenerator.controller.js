const rewindImageGenerationService = require('../services/rewindImageGeneration.service');

class ImageGenerator {
    async generatorImage(req, res) {
        try {
            const stats = req.body;
            let a = Date.now();
            // Collect promises for parallel execution
            const promises = [];
            for (let i = 0; i < stats.length; i++) {
                if(["StreakLength","TotalWalletTransactionMetric","TotalGasSaved","DeveloperInfoMetric","TestnetTxnCount","MemecoinMetric","FavouriteChainMetric","TopNChains","FavouriteDappMetric","DayDistributionMetric","NftInfoMetric","DeveloperInfoMetric","TestnetTxnCount","RektCoinMetric","HodlCoinMetric","NftMint", "NftCardMetric"].includes(stats[i].metricType)){
                    let stat = {
                        "cardType": stats[i].metricType,
                        "cardData": stats[i].metricData
                    }
                    // Push the promise to the array
                    promises.push(rewindImageGenerationService.generateRewindService(stat).then(r => {
                        return { metricType: stats[i].metricType, cardUrl:  r.publicUrl.replace('%2F', '/'), profileImageLink:  r.profileImageLink?.replace('%2F', '/') };
                    }));
                }
            }
            // Wait for all promises to resolve
            const response = await Promise.all(promises);
            console.log('response time :: ',Date.now() - a);
            
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


