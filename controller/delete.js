module.exports = {

  delete : function(req, res){
    console.log('delete')

    var contactKey = req.query.contactkey;


    const optionsRestReq = {
      uri: '/contacts/v1/contacts/actions/delete?type=keys',
      headers:{},
      json: {
        "ContactTypeId": "0",
        "values": [contactKey],
          "DeleteOperationType": "ContactAndAttributes"
        }
    };

    const RestClient = new FuelRest(optionsRest);


    RestClient.post(optionsRestReq, (err, response) => {
      if (err) {
        // error here
        console.log('error');
        console.log(err);
      }

      // will be delivered with 200, 400, 401, 500, etc status codes
      // response.body === payload from response
      // response.res === full response from request client
      console.log('response');
      console.log(response);
    });

    res.setHeader('Content-Type', 'application/json');
    res.send(JSON.stringify({ Status: 'Deleted' }));
    return ;
  }

}
