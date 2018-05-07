module.exports = {

  delete : function(req, res){
    console.log('delete')


    res.setHeader('Content-Type', 'application/json');
    res.send(JSON.stringify({ Status: 'Deleted' }));
    return ;
  }

}
