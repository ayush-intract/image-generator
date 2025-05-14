const hexesImageGenerationService = require('../services/hexesImageGeneration.service');

class HexesImageGenerator {
    async generatorHexesImage(req, res) {
        try {
            const data = req.body;
            let a = Date.now();
            console.log('input data ::',data)
            // Collect promises for parallel execution
            const promises = [];
            for (let i = 0; i < data.length; i++) {
                // let stat = {
                //     hexDifficulty: data[i].hexDifficulty,
                //     projectLogo: data[i].projectLogo,
                //     projectName: data[i].projectName,
                //     questName: data[i].questName,
                //     hexType: data[i].hexType,
                //     chainLogo: data[i].chainLogo,
                //     userAddress: data[i].userAddress,
                //     hexId: data[i].hexId,
                //     userId: data[i].userId,
                //     timeStamp: data[i].timeStamp,
                //     activityType: data[i].activityType,
                // }
                // Push the promise to the array
                promises.push(hexesImageGenerationService.generateHexesService(data[i]).then(r => {
                    return { 
                        publicUrl:  r?.publicUrl?.replace('%2F', '/')?.replace('storage.googleapis.com/static.highongrowth.xyz', 'static.highongrowth.xyz'),
                        metaDataUrl: r?.metaDataUrl?.replace('%2F', '/')?.replace('storage.googleapis.com/static.highongrowth.xyz', 'static.highongrowth.xyz')
                     };
                }));
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

const hexesImageGeneratorInstance = new HexesImageGenerator();

module.exports = {
    hexesImageGeneratorInstance
}

