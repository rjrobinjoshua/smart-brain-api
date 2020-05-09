const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const basicAuth = require('express-basic-auth')
const env = require('./config/env');
const authController = require('./controllers/auth-controller');
const userController = require('./controllers/user-controller');
const clarifaiController = require('./controllers/clarifai-controller');


const app = express();

// middlewares
app.use(bodyParser.json());
app.use(cors());
app.use(/\/((?!(signin|register)).)*/, basicAuth({ authorizer: myAuthorizer }))

app.get('/', (req, res) => res.send('<h1>Welcome to Smart-brain API</h1>'));
// auth API
app.post('/signin', authController.signIn);
app.post('/register', authController.register);

// user API
app.get('/user/:id', userController.findUser);
app.put('/user/entries', userController.updateEntries)

// image API
app.post('/image', clarifaiController.predictImage);

function myAuthorizer(username, password) {
  const userMatches = basicAuth.safeCompare(username, 'admin')
  const passwordMatches = basicAuth.safeCompare(password, 'supersecret')

  return userMatches & passwordMatches
}

app.listen(env.port, () => {
    console.log(`
    ################################################
    🛡️  Server listening on port: ${env.port} 🛡️ 
    ################################################
  `)
})
