var request = require('./');
var i = 0;

request('http://google.com')
  .throttle(3, '1s')
  .delay('1s', '10s')
  .concurrency(2)
  .paginate('a[href]')
  .limit(7)
  .request(function(request) {
    // ... modify request object
  })
  .response(function(response) {
    // ... modify response object
  })
  .fetch(function(err, res) {
    if (err) throw err;
    console.log('done!');
  })
  .on('response', function($, ctx) {
    // console.log('title %s', $('title').text());
  });
