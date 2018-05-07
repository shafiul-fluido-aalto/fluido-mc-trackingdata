module.exports = {



    login : function(req, res){
      var jwt = require('jwt-simple');

      console.log(req.body.jwt)

      var secret = process.env.SECRET;
      var decodedJWT = jwt.decode(req.body.jwt, secret);
      console.log(decodedJWT);
    /*  res.setHeader('Content-Type', 'application/json');
      res.send(JSON.stringify({ decodedJWT }));
      return ;*/
    },


}
