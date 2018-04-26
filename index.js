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

    // contact key
    if( !req.query.contactkey ){
      console.log('Authentication failed');
      res.setHeader('Content-Type', 'application/json');
      res.send(JSON.stringify({ error: 'ContactKey missing' }));
      return ;
    }

    var contactKey = req.query.contactkey;

    // MC API  authentication
    var FuelSoap = require('fuel-soap');
    var options = {
      auth: {
        clientId: process.env.CLIENT_ID,
        clientSecret: process.env.CLIENT_SECRET
      },
      soapEndpoint: process.env.API_URL
    };

    var SoapClient = new FuelSoap(options);


    var tracking = {};
    var calls = 0;
    var callsToWait = 3;

    var reqoptions = {
      filter: {
        leftOperand: 'SubscriberKey',
        operator: 'equals',
        rightOperand: contactKey
      }
    };

    // retriece sends
    SoapClient.retrieve(
      'SentEvent',
      ["EventDate","SendID","SubscriberKey"],
      reqoptions,
      function( err, response ) {
        if ( err ) {
          console.log( err );
          return;
        }

        try{
          var rows =  response.body.Results;
          for (var i=0; i < rows.length; i++){
            var row = rows[i];
            if(!tracking[row['SendID']]){
              tracking[row['SendID']] = { Sent: [], Click: [], Open:[] };
            }
            tracking[row['SendID']]['Sent'].push(row.EventDate);
          }
          calls++;
          if(calls==callsToWait){
            console.log( tracking );
            res.setHeader('Content-Type', 'application/json');
            res.send(JSON.stringify({ tracking }));
            return ;
          }
        }catch(e){
          console.log(e);
        }
      }
    );

    // retrieve clicks
    SoapClient.retrieve(
      'ClickEvent',
      ["EventDate","SendID","SubscriberKey","URL"],
      reqoptions,
      function( err, response ) {
        if ( err ) {
          console.log( err );
          return;
        }

        try{
          var rows =  response.body.Results;
          for (var i=0; i < rows.length; i++){
            var row = rows[i];
            if(!tracking[row['SendID']]){
              tracking[row['SendID']] = { Sent: [], Click: [], Open:[] };
            }
            tracking[row['SendID']]['Click'].push(row.EventDate+' 'row.URL);
          }
          calls++;
          if(calls==callsToWait){
            console.log( tracking );
            res.setHeader('Content-Type', 'application/json');
            res.send(JSON.stringify({ tracking }));
            return ;
          }
        }catch(e){
          console.log(e);
        }
      }
    );

    // retrieve opens
    SoapClient.retrieve(
      'OpenEvent',
      ["EventDate","SendID","SubscriberKey"],
      reqoptions,
      function( err, response ) {
        if ( err ) {
          console.log( err );
          return;
        }

        try{
          var rows =  response.body.Results;
          for (var i=0; i < rows.length; i++){
            var row = rows[i];
            if(!tracking[row['SendID']]){
              tracking[row['SendID']] = { Sent: [], Click: [], Open:[] };
            }
            tracking[row['SendID']]['Open'].push(row.EventDate);
          }

          calls++;
          if(calls==callsToWait){

            console.log( tracking );
            res.setHeader('Content-Type', 'application/json');
            res.send(JSON.stringify({ tracking }));
            return ;
          }
        }catch(e){
          console.log(e);
        }
      }
    );




  })
  .listen(PORT, () => console.log(`Listening on ${ PORT }`))
