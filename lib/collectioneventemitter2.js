/**
 * Module dependencies.
 */
var EventEmitter2 = require('eventemitter2').EventEmitter2,
    util = require('util'),
    _ = require('lodash/dist/lodash.underscore');

// Name of the default array field of the collection
var defaultName = 'models';

/**
 * `CollectionEventEmitter` class
 * Implements Collection-like methods helpful in dealing with JavaScript arrays defined
 * Also extends `EventEmitter`
 * @param name {String}: the name of the property
 *
 * @api public
 */
function CollectionEventEmitter(name, options) {
  CollectionEventEmitter.super_.call(this, options);

  // Use the defaultName if not given a name
  // The defaultName is configurable
  this.name = name || CollectionEventEmitter.defaultName;
}

/**
 * Inherit from `EventEmitter`.
 */
util.inherits(CollectionEventEmitter, EventEmitter2);

/**
 * `defaultName` of the property which contains the array
 * Defaults to `models`
 *
 * @api public
 */
CollectionEventEmitter.defaultName = defaultName;

// Underscore methods that we want to implement on the Collection.
// 90% of the core usefulness of Collections is actually implemented right here:
var methods = ['forEach', 'each', 'map', 'collect', 'reduce', 'foldl',
  'inject', 'reduceRight', 'foldr', 'find', 'detect', 'filter', 'select',
  'reject', 'every', 'all', 'some', 'any', 'include', 'contains', 'invoke',
  'max', 'min', 'toArray', 'size', 'first', 'head', 'take', 'initial', 'rest',
  'tail', 'drop', 'last', 'without', 'indexOf', 'shuffle', 'lastIndexOf',
  'isEmpty', 'chain'];

// Mix in each Underscore method as a proxy to `this[this.name]`
_.each(methods, function(method) {
  CollectionEventEmitter.prototype[method] = function() {
    var args = Array.prototype.slice.call(arguments);
    args.unshift(this[this.name]);
    return _[method].apply(_, args);
  };
});

// Underscore methods that take a property name as an argument.
var attributeMethods = ['groupBy', 'countBy', 'sortBy'];

// Use attributes instead of properties.
_.each(attributeMethods, function(method) {
  CollectionEventEmitter.prototype[method] = function(value, context) {
    var iterator = _.isFunction(value) ? value : function(model) {
      return model.get(value);
    };
    return _[method](this[this.name], iterator, context);
  };
});

/**
 * Expose `CollectionEventEmitter`.
 */
module.exports = CollectionEventEmitter;
