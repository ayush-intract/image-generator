// import { Router } from 'express';
const Router = require('express').Router;
const router = Router();
const { imageGeneratorInstance } = require('../controllers/imageGenerator.controller');
const { tweetImageGeneratorInstance } = require('../controllers/tweetImageGenerator.controller');
const { bantrImageGeneratorInstance } = require('../controllers/bantrGenerator.controller');

router.get('/', async (req, res) => {
    return res.json({
        message: "Rewind-Image-Generation-Service V1",
    })
})

router.post('/generate-bantr-image', bantrImageGeneratorInstance.generatorBantrImage.bind(bantrImageGeneratorInstance));

router.post('/generate-v1', imageGeneratorInstance.generatorImage.bind(imageGeneratorInstance)); 

router.post('/generate-bantr-rewind', imageGeneratorInstance.generatorImage.bind(imageGeneratorInstance)); 

router.post('/tweet-generate', tweetImageGeneratorInstance.generatorTweetImage.bind(tweetImageGeneratorInstance));

module.exports = router;

