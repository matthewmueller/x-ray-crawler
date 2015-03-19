/**
 * Module Dependencies
 */

var superagent = require('superagent');
var wrapfn = require('wrap-fn');

/**
 * Export `driver`
 */

module.exports = driver;

/**
 * HTTP driver
 */

function driver(opts) {
  var agent = superagent.agent(opts || {});

  return function http_driver(ctx, fn) {
    agent
      .get(ctx.url)
      .set(ctx.headers)
      .end(function(err, res) {
        if (err) return fn(err);

        ctx.status = res.status;
        ctx.set(res.headers);

        if ('application/json' == ctx.type) {
          ctx.body = res.body;
        } else {
          ctx.body = res.text;
        }

        // update the URL if there were redirects
        ctx.url = res.redirects.length
          ? res.redirects.pop()
          : ctx.url;

        return fn(null, ctx);
      });
  }
}
