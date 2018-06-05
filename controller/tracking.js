module.exports = {



    getTracking : function(req, res, authController){

      // runtime variables
      var contactKey = req.query.contactkey;
      var tracking = {};
      var calls = 0;
      var callsToWait = 3;

      var bu_identifier = "";
      if(req.query.bu > 0){
        var bu_identifier = "_"+req.query.bu;
      }
      var clientid = process.env['CLIENT_ID'+bu_identifier]
      var clientsecret = process.env['CLIENT_SECRET'+bu_identifier]


      // Start sending a reponse
      //res.setHeader('Content-Type', 'application/json');
      res.writeHead(200, {"Content-Type" : 'application/json'});

      // MC API  authentication
      var FuelSoap = require('fuel-soap');
      var options = {
        auth: {
          clientId: clientid,
          clientSecret: clientsecret
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
          console.log( response );

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
              //res.setHeader('Content-Type', 'application/json');
              //res.status(200).send(JSON.stringify({ tracking }));
              res.write(JSON.stringify({ tracking })).end();
              return ;
            }else res.write("");
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
          console.log( response );
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
              //res.setHeader('Content-Type', 'application/json');
              //res.status(200).send(JSON.stringify({ tracking }));
              res.write(JSON.stringify({ tracking })).end();
              return ;
            }else res.write("");
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
          console.log( response );
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
              //res.setHeader('Content-Type', 'application/json');
              //res.status(200).send(JSON.stringify({ tracking }));
              res.write(JSON.stringify({ tracking })).end();
              return ;
            }else res.write("");
          }catch(e){
            console.log(e);
          }
        }
      );
    },


}
