const express = require('express')
const path = require('path')
const PORT = process.env.PORT || 5000
const trackingController = require('./controller/tracking');
const authController = require('./controller/auth');
const deleteController = require('./controller/delete');
const loginController = require('./controller/login');
const appController = require('./controller/app');
const bodyParser = require('body-parser');

const app = express()
app.use(bodyParser.urlencoded());
app.use(bodyParser.json());
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'ejs')
app.listen(PORT, () => console.log(`Listening on ${ PORT }`))

app.get('/tracking', (req, res) => {

  //authentication
  authController.auth(req, res)

  // export tracking
  trackingController.getTracking(req, res)
})

app.get('/delete', (req, res) => {

  //authentication
  authController.auth(req, res)

  // export tracking
  deleteController.delete(req, res)
})

app.post('/login', (req, res) => {

  //authentication
  loginContoller.login(req, res)
})

app.post('/app', (req, res) => {

  var jwt = require('jwt-simple');
  var secret = process.env.SECRET;

  // authentication
  var decodedJWT = jwt.decode(req.body.jwt, secret);
  console.log(decodedJWT);
  if(!decodedJWT.jti){
    // error message - authentication fails
    res.setHeader('Content-Type', 'application/json');
    res.send(JSON.stringify({ error: 'JWT fails, check that MC installed app secret matches with SECRET env variable.' }));
    return ;
  }else{
    //app ui
    appController.app(req, res)
  }
})
