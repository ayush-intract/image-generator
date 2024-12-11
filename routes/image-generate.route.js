// import { Router } from 'express';
const Router = require('express').Router;
const router = Router();
const { imageGeneratorInstance } = require('../controllers/imageGenerator.controller');
const { tweetImageGeneratorInstance } = require('../controllers/tweetImageGenerator.controller');

router.get('/', async (req, res) => {
    return res.json({
        message: "Rewind-Image-Generation-Service V1",
    })
})

router.post('/generate-v1', imageGeneratorInstance.generatorImage.bind(imageGeneratorInstance)); 

router.post('/tweet-generate', tweetImageGeneratorInstance.generatorTweetImage.bind(tweetImageGeneratorInstance));

module.exports = router;
