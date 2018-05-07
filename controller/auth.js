module.exports = {



    auth : function(req, res){
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
    },


}
