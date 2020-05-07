const Clarifai = require('clarifai');
const env = require('./env');


const clarifaiApp = new Clarifai.App({
    apiKey: env.clarifai.apikey
});

module.exports = { clarifaiApp }; 