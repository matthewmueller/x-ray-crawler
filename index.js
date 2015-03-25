/**
 * Export `Crawler`
 */

module.exports = Crawler;

/**
 * Module Dependencies
 */

var Emitter = require('emitter-component');
var context = require('http-context');
var delegate = require('delegates');
var parse = require('url').parse;
var cheerio = require('cheerio');
var selectn = require('selectn');
var enqueue = require('enqueue');
var yieldly = require('yieldly');
var wrapfn = require('wrap-fn');
var isArray = Array.isArray;
var noop = function(){};
var ms = require('ms');

/**
 * Locals
 */

var rate_limit = require('./lib/rate-limit');
var http = require('./lib/http-driver');
var range = require('./lib/range');

/**
 * Debug
 */

var debug = require('debug')('x-ray-crawler');

/**
 * Initialize `Crawler`
 */

function Crawler(driver) {
  if (!(this instanceof Crawler)) return new Crawler(driver);
  var self = this;

  // default state
  this.state = {
    driver: driver || http(),
    throttle: rate_limit(),
    concurrency: Infinity,
    limit: Infinity,
    delay: range(),
    timeout: false,
    response: noop,
    request: noop,
  };

  // scheduled & queueing
  this.scheduled = 0;
  this.queue = false;

  /**
   * NEED TO DO THE MODELLA THING
   */

  return function fetch(url, fn) {
    if (!self.queue) {
      self.queue = enqueue(self.get.bind(self), {
        concurrency: self.concurrency(),
        timeout: self.timeout(),
        limit: self.limit()
      });

      self.scheduled++;
      self.queue(url, fn);
    } else {
      self.scheduled++;
      self.schedule(url, fn);
    }
  };
}

/**
 * Delegates
 */

delegate(Crawler.prototype, 'state')
  .fluent('concurrency')
  .fluent('response')
  .fluent('request')
  .fluent('driver')
  .fluent('throws')
  .fluent('limit');

/**
 * Throttle according to a rate limit
 *
 * @param {Number|String} requests
 * @param {Number|String} rate
 * @return {Number|Crawler}
 * @api public
 */

Crawler.prototype.throttle = function(requests, rate) {
  if (!arguments.length) return this.state.throttle();
  else if (1 == arguments.length) rate = requests, requests = 1;
  rate = /^\d/.test(rate) ? rate : 1 + rate;
  rate = 'string' == typeof rate ? ms(rate) : rate;
  this.state.throttle = rate_limit(requests, rate);
  return this;
};

/**
 * Delay subsequent requests
 *
 * @param {String|Number} from
 * @param {String|Number} to (optional)
 * @return {Number|Crawler}
 * @api public
 */

Crawler.prototype.delay = function(from, to) {
  if (!arguments.length) return this.state.delay();
  from = 'string' == typeof from ? ms(from) : from;
  to = 'string' == typeof to ? ms(to) : to;
  this.state.delay = range(from, to);
  return this;
};

/**
 * Specify a request timeout
 *
 * @param {String|Number} timeout
 * @return {Number|Crawler}
 * @api public
 */

Crawler.prototype.timeout = function(timeout) {
  if (!arguments.length) return this.state.timeout;
  timeout = 'string' == typeof timeout ? ms(timeout) : timeout;
  this.state.timeout = timeout;
  return this;
};

/**
 * Fetch
 *
 * @param {String} url
 * @param {Function} fn
 * @return {Crawler}
 * @api public
 */
//
// Crawler.prototype.fetch = function(url, done) {
//   var concurrency = this.concurrency();
//   var throttle = this.throttle();
//   var throws = this.throws();
//   var limit = this.limit();
//   var delay = this.delay();
//   var url = this.url;
//   var scheduled = 0;
//   var self = this;
//
//   // initial request
//   debug('initial request: %s', url);
//
//   // queue options
//   var options = {
//     concurrency: this.concurrency(),
//     timeout: this.timeout(),
//     limit: limit
//   };
//
//   // setup the queue
//   var queue = enqueue(function(url, next) {
//     self.get(url, next);
//   }, options);
//
//   return this;
// }

Crawler.prototype.schedule = function(url, fn) {
  // if specified, throttle requests and add a delay
  var wait = this.throttle() + this.delay();
  var queue = this.queue;

  debug('queued "%s", waiting "%sms"', url, wait);

  this.scheduled++;
  setTimeout(function() {
    // queue up next request
    var queued = queue(url, fn);
    if (!queued) return;
  }, wait);
}

/**
 * get
 */

Crawler.prototype.get = function(url, fn) {
  console.log('getting %s', url);
  return this;
};


var crawl = Crawler()
  .concurrency(2);

crawl('http://google.com', function(err, ctx) {
  if (err) throw err;
  console.log('done!');
})


crawl('http://facebook.com', function(err, ctx) {
  if (err) throw err;
  console.log('done!');
})


crawl('http://facebook.com', function(err, ctx) {
  if (err) throw err;
  console.log('done!');
})
