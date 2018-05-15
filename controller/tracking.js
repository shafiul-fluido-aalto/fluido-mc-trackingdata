module.exports = {



    getTracking : function(req, res, authController){

      // runtime variables
      var contactKey = req.query.contactkey;
      var tracking = {};
      var calls = 0;
      var callsToWait = 3;




      // MC API  authentication
      var FuelSoap = require('fuel-soap');
      var options = {
        auth: {
          clientId: process.env.CLIENT_ID,
          clientSecret: process.env.CLIENT_SECRET
        },
        soapEndpoint: process.env.API_URL
      };

      // SDK
      var SoapClient = new FuelSoap(options);


      // search by SubscriberKey
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
              res.status(200).send(JSON.stringify({ tracking }));
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
              tracking[row['SendID']]['Click'].push(row.EventDate);
            }
            calls++;
            if(calls==callsToWait){
              console.log( tracking );
              res.setHeader('Content-Type', 'application/json');
              res.status(200).send(JSON.stringify({ tracking }));
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
              res.status(200).send(JSON.stringify({ tracking }));
              return ;
            }
          }catch(e){
            console.log(e);
          }
        }
      );
    },


}
