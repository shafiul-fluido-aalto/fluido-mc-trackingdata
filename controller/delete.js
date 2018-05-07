module.exports = {

  delete : function(req, res){
    console.log('delete')

    var contactKey = req.query.contactkey;

    const FuelRest = require('fuel-rest');
    const optionsRest = {
      auth: {
        clientId: process.env.CLIENT_ID,
        clientSecret: process.env.CLIENT_SECRET
      },
      //origin: 'https://webservice.s10.exacttarget.com/Service.asmx' // default --> https://www.exacttargetapis.com
    };

    const RestClient = new FuelRest(optionsRest);

    const optionsRestReq = {
      uri: '/contacts/v1/contacts/actions/delete?type=keys',
      headers:{},
      json: {
        "ContactTypeId": "0",
        "values": [contactKey],
          "DeleteOperationType": "ContactAndAttributes"
        }
    };

    RestClient.post(optionsRestReq, (err, response) => {
      if (err) {

        console.log('error');
        console.log(response);
        res.setHeader('Content-Type', 'application/json');
        res.send(JSON.stringify({ error: err }));
        return ;
      }

      // will be delivered with 200, 400, 401, 500, etc status codes
      // response.body === payload from response
      // response.res === full response from request client

      console.log(response);
      res.setHeader('Content-Type', 'application/json');
      res.send(JSON.stringify(response));
      return ;
    });


  }

}
