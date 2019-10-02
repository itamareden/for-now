const express = require('express');
const path = require('path');
const app = express();

app.use(express.static(__dirname + '/dist/Herolo'));

// Send all requests to index.html
app.get('/*', function(req, res) {
  res.sendFile(path.join(__dirname + '/dist/Herolo/index.html'));
});

// default Heroku PORT
app.listen(process.env.PORT || 3000);