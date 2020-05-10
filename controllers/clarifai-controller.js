const { clarifaiApp } = require('../config/clarifai');

predictImage = (req, res) => {

    const { url } = req.body;
    if(!url) {
        return res.status(400).json('required input not found');
    }

    clarifaiApp.models
    .predict(Clarifai.FACE_DETECT_MODEL, url)
    .then(data => res.json(data))
    .catch(err => { 
        console.log(err.message);
        res.status(400).json("Unable to work with API");
    });
}

module.exports = {
    predictImage
}