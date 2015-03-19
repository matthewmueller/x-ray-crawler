/**
 * Export `select`
 */

module.exports = select;

/**
 * Select
 *
 * TODO: own module
 */

function select($, select) {
  var selector = parse(select);
  return render($(selector.selector), selector);
}

/**
 * Format parser
 *
 * TODO: Own module
 *
 * @param {String}
 * @param {Object} filters
 * @return {Object}
 */

function parse(str) {
  var rselector = /([^\[]+)?(?:\[([^\[]+)\])?/;
  var rfilters = /\s*\|\s*/;
  var formatters = str.split(rfilters);
  str = formatters.shift();

  var m = str.match(rselector) || [];

  return {
    selector: m[1],
    attribute: m[2]
  };
}

/**
 * render
 *
 * TODO: own module
 *
 * @param {Cheerio Element} $el
 * @param {Object} select
 */

function render($el, select) {
  var rdom = /^(tagName|nodeType)$/;

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
