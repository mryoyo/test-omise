'use strict'

var express = require('express')
var bodyParser = require('body-parser');
var exphbs = require('express-handlebars');

var app = express();

app.use(bodyParser.urlencoded({ extended: false }))

app.engine('.html', exphbs());
app.set('view engine', 'handlebars');

app.use('/static', express.static(__dirname+'/public'))

// FORM
app.get('/', function (req, res) {
  res.render('form.html');
});

// SUBMIT TOKEN
app.post('/submit', function (req, res) {

  console.log(req.body)

  var tokenId = req.body.tokenId

  var omise = require('omise')({
    'secretKey': 'skey_test_...',
    'omiseVersion': '2015-09-10'
  });
  omise.charges.create({
    'description': 'Charge for order ID: 888',
    'amount': '100000', // 1,000 Baht
    'currency': 'thb',
    'capture': false,
    'card': tokenId
  }, function(err, resp) {
    if (resp.paid) {
      res.send('OK')
    } else {
      //Handle failure
      // throw resp.failure_code;
      console.log(res)
      res.send('FAILED')
    }
  });
})

// CALLBACK
app.post('/callback/:order_id', function (res, req) {
  console.log(res.params.order_id)
  console.log(res.body)
  res.send('OK')
});

app.listen(3000, function () {
  console.log('server started ...')
});
