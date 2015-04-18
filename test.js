/**
 * Module Dependencies
 */

var crawler = require('./')
var superagent = require('superagent')
var agent = superagent.agent({})

/**
 * Crawl the biggest crawler in the world
 */


 var crawl = crawler()
   .throttle(3, '1s')
   .delay('1s', '10s')
   .driver(http)
   .concurrency(2)
   .limit(20)

crawl('http://lapwinglabs.com', function(err, ctx) {
  if (err) throw err
  console.log(ctx.status)
})

function http(ctx, fn) {
  console.log('using this driver...');
  agent
    .get(ctx.url)
    .set(ctx.headers)
    .end(function(err, res) {
      if (err) return fn(err)

      ctx.status = res.status
      ctx.set(res.headers)

      ctx.body = 'application/json' == ctx.type
        ? res.body
        : res.text

      // update the URL if there were redirects
      ctx.url = res.redirects.length
        ? res.redirects.pop()
        : ctx.url

      return fn(null, ctx)
    })
}
