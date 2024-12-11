// import { Router } from 'express';
const Router = require('express').Router;
const router = Router();
const { imageGeneratorInstance } = require('../controllers/imageGenerator.controller');

router.get('/', async (req, res) => {
    return res.json({
        message: "Rewind-Image-Generation-Service V1",
    })
})

router.post('/generate-v1', imageGeneratorInstance.generatorImage.bind(imageGeneratorInstance)); 

module.exports = router;

