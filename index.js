const express = require('express')
const path = require('path')
const PORT = process.env.PORT || 5000

express()

  .get('/', (req, res) => {

    // APP authentication
    if( req.query.clientid != process.env.APP_CLIENT_ID || req.query.clientsecret != process.env.APP_CLIENT_SECRET ){
      console.log('Authentication failed');
      res.setHeader('Content-Type', 'application/json');
      res.send(JSON.stringify({ error: 'Authentication failed' }));
      return ;
    }


    // MC API  authentication
    var FuelSoap = require('fuel-soap');
    var options = {
      auth: {
        clientId: process.env.CLIENT_ID
        , clientSecret: process.env.CLIENT_SECRET
      }
      , soapEndpoint: 'https://webservice.s10.exacttarget.com/Service.asmx' // default --> https://webservice.exacttarget.com/Service.asmx
    };

    var SoapClient = new FuelSoap(options);
    console.log(SoapClient); 

    // return json object
    res.setHeader('Content-Type', 'application/json');
    res.send(JSON.stringify({ a: 1 }));

  })
  .listen(PORT, () => console.log(`Listening on ${ PORT }`))
