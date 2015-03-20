/**
 * Module Dependencies
 */

var resolve = require('url').resolve;

/**
 * Export `absolute`
 */

module.exports = absolute;

/**
 * Attribute map
 */

var attrs = {
  iframe: 'src',
  script: 'src',
  source: 'src',
  track: 'src',
  frame: 'src',
  img: 'href',
  link: 'src',
  img: 'src',
  a: 'href',
};

/**
 * Build the selector
 */

var selector = Object.keys(attrs).map(function(k) {
  return k + '[' + attrs[k] + ']';
}).join(',');

/**
 * Change all the URLs into absolute urls
 *
 * @param {String} host
 * @param {Cheerio} $
 * @return {$}
 */

function absolute(host, $) {
  $(selector).each(function(i, el) {
    var attr = attrs[el.name];
    var path = el.attribs[attr];
    var abs = resolve(host, path);
    el.attribs[attr] = abs;
  });

  return $;
}
