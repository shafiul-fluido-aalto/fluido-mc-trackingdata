const express = require('express')
const path = require('path')
const PORT = process.env.PORT || 5000

express()

  .get('/', (req, res) => {

    // return json object
    res.setHeader('Content-Type', 'application/json');
    res.send(JSON.stringify({ a: 1 }));

  })
  .listen(PORT, () => console.log(`Listening on ${ PORT }`))
