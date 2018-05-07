const express = require('express')
const path = require('path')
const PORT = process.env.PORT || 5000
const trackingController = require('./controller/tracking');
const bodyParser = require('body-parser');

const app = express()
app.use(bodyParser.urlencoded());
app.use(bodyParser.json());
app.listen(PORT, () => console.log(`Listening on ${ PORT }`))

app.get('/tracking', (req, res) => {
  // APP authentication
  if( req.query.clientid != process.env.APP_CLIENT_ID || req.query.clientsecret != process.env.APP_CLIENT_SECRET ){
    console.log('Authentication failed');
    res.setHeader('Content-Type', 'application/json');
    res.send(JSON.stringify({ error: 'Authentication failed' }));
    return ;
  }

  // contact key
  if( !req.query.contactkey ){
    console.log('Authentication failed');
    res.setHeader('Content-Type', 'application/json');
    res.send(JSON.stringify({ error: 'ContactKey missing' }));
    return ;
  }
  loginContoller.login(req, res)
})
