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
       
      };

      // SDK
      var SoapClient = new FuelSoap(options);

        console.log('FuelSoap SoapClient? => ',SoapClient);
        
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
          }catch(e){
            console.log(e);
          }
        }
      );


      (function keepALiveAndSendResults () {
         setTimeout(function () {
            console.log('waiting... ' + calls);
            if(calls==callsToWait){
              console.log('All responses ready. Output the json.');
              res.write(JSON.stringify({ tracking }));
              res.end();
              return ;
            }else{
              res.write(" "); // keep the connection open (Heroku has 30sec hard coded timeout for client requests )
              keepALiveAndSendResults();
            }
         }, 1000)
      })();
    },




}
