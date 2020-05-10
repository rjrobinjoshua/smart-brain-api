const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const basicAuth = require('express-basic-auth')
const env = require('./config/env');
const authController = require('./controllers/auth-controller');
const userController = require('./controllers/user-controller');
const clarifaiController = require('./controllers/clarifai-controller');
const authService = require('./services/auth-service');


const app = express();

const myAsyncAuthorizer = (username, password, cb) => {

  authService.authenticate(username, password)
      .then(result => { 
        return cb(null, result);
      });
}

// middlewares
app.use(bodyParser.json());
app.use(cors());
// bypass auth for login and register
app.use(/\/((?!(signin|register)).)*/, basicAuth({ 
        authorizer: myAsyncAuthorizer,
        authorizeAsync: true,
      }))

app.get('/', (req, res) => res.send('<h1>Welcome to Smart-brain API</h1>'));
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
