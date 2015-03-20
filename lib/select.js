/**
 * Module Dependencies
 */

var parse = require('x-ray-parse');
var rdom = /^(tagName|nodeType)$/;

/**
 * Export `select`
 */

module.exports = select;

/**
 * Select
 *
 * @param {Cheerio} $
 * @param {String} selector
 */

function select($, select) {
  var selector = parse(select);
  return render($(selector.selector), selector);
}

/**
 * Render
 *
 * @param {Cheerio Element} $el
 * @param {Object} select
 */

function render($el, select) {

  switch (select.attribute) {
    case 'html': return map($el, 'html');
    case undefined: return map($el, 'text');
    default:
      return rdom.test(select.attribute)
        ? map($el, 'attr', select.attribute)
        : map($el, 'attr', select.attribute);
  }

  function map($el, fn, attr) {
    var out = [];
    $el.each(function(i) {
      out.push($el.eq(i)[fn](attr));
    });
    return out;
  }
}
