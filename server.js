const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const basicAuth = require('express-basic-auth')
const env = require('./config/env');
const authController = require('./controllers/auth-controller');
const userController = require('./controllers/user-controller');
const clarifaiController = require('./controllers/clarifai-controller');
const authService = require('./services/auth-service');
const rateLimit = require("express-rate-limit");


const app = express();

const limiter = rateLimit({
  windowMs: env.rateLimit.windowMs,
  max: env.rateLimit.max,
  onLimitReached: printLimitReachedReq
});


// middlewares
app.use(bodyParser.json());
app.use(cors());
// bypass auth for login and register
app.use(/\/((?!(signin|register)).)*/, basicAuth({ 
        authorizer: myAsyncAuthorizer,
        authorizeAsync: true,
      }))
// rate limiter
app.use(limiter);


//APIs
app.get('/', (req, res) => res.send('<h1>Welcome to Smart-brain API</h1>'));
// auth API
app.post('/signin', authController.signIn);
app.post('/register', authController.register);

// user API
app.get('/user/:id', userController.findUser);
app.put('/user/entries', userController.updateEntries);

// image API
app.post('/image', clarifaiController.predictImage);

function myAsyncAuthorizer(username, password, cb){

  authService.authenticate(username, password)
      .then(result => { 
        return cb(null, result);
      });
}

function printLimitReachedReq(req, res, options) {
  console.log(req.ip +" crossed the current rate limit");
  console.log(req.rateLimit);
}

app.listen(env.port, () => {
    console.log(`
    ################################################
    🛡️  Server listening on port: ${env.port} 🛡️ 
    ################################################
  `)
})
