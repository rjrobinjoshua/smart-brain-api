const { clarifaiApp } = require('../config/clarifai');

predictImage = (req, res) => {
    clarifaiApp.models
    .predict(Clarifai.FACE_DETECT_MODEL, req.body.url)
    .then(data => res.json(data))
    .catch(err => { 
        console.log(err);
        res.status(400).json("Unable to work with API");
    });
}

module.exports = {
    predictImage
}