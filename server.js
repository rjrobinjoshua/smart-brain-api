const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const env = require('./config/env');
const authController = require('./controllers/auth');
const userController = require('./controllers/user');
const clarifaiController = require('./controllers/clarifai');


const app = express();

// middlewares
app.use(bodyParser.json());
app.use(cors());

// auth API
app.post('/signin', authController.signIn);
app.post('/register', authController.register);

// user API
app.get('/user/:id', userController.findUser);
app.put('/user/entries', userController.updateEntries)

// image API
app.post('/image', clarifaiController.predictImage);

app.listen(env.port, () => {
    console.log(`
    ################################################
    🛡️  Server listening on port: ${env.port} 🛡️ 
    ################################################
  `)
})
