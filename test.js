/**
 * Module Dependencies
 */

var crawler = require('./')

/**
 * Crawl the biggest crawler in the world
 */

 var crawl = crawler()
   .throttle(3, '1s')
   .delay('1s', '10s')
   .concurrency(2)
   .limit(20)

crawl('http://lapwinglabs.com', function(err, ctx) {
  if (err) throw err
  console.log(ctx.status)
})
