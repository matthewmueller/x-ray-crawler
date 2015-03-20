/**
 * Module Dependencies
 */

var crawler = require('./');

/**
 * Crawl the biggest crawler in the world
 */

crawler('http://google.com')
  .throttle(3, '1s')
  .delay('1s', '10s')
  .concurrency(2)
  .paginate('a[href] @ href')
  .request(function(request) {
    // ... modify request object
  })
  .response(function(response) {
    // ... modify response object
  })
  .crawl(function(err, res) {
    if (err) throw err;
    console.log('done!');
  })
  .on('response', function($, ctx) {
    console.log('title %s', $('title').text());
  });
