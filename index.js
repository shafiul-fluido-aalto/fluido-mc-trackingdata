const express = require('express')
const path = require('path')
const PORT = process.env.PORT || 5000
const trackingController = require('./controller/tracking');
const authController = require('./controller/auth');
const deleteController = require('./controller/delete');
const bodyParser = require('body-parser');

const app = express()
app.use(bodyParser.urlencoded());
app.use(bodyParser.json());
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
