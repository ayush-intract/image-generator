// import { Router } from 'express';
const Router = require('express').Router;
const router = Router();
const { imageGeneratorInstance } = require('../controllers/imageGenerator.controller');
const { tweetImageGeneratorInstance } = require('../controllers/tweetImageGenerator.controller');
const { hexesImageGeneratorInstance } = require('../controllers/hexesImageGenerator.controller');

router.get('/', async (req, res) => {
    return res.json({
        message: "Rewind-Image-Generation-Service V1",
    })
})

router.post('/generate-v1', imageGeneratorInstance.generatorImage.bind(imageGeneratorInstance)); 

router.post('/tweet-generate', tweetImageGeneratorInstance.generatorTweetImage.bind(tweetImageGeneratorInstance));

router.post('/hexes-generate', hexesImageGeneratorInstance.generatorHexesImage.bind(hexesImageGeneratorInstance));

module.exports = router;

