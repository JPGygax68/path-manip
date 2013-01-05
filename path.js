(function() {

if (typeof define !== 'function') var define = function() { 
    var func = arguments[arguments.length-1];
    module.exports = func();
    //for (var key in _exports) if (_exports.hasOwnProperty(key)) exports[key] = _exports[key];
};

define( function() {

    function Path() {}
    
    Path.prototype = new Array();
    
    Path.prototype.toString = function() { return ''; } // TODO
    
    return Path;
});

}) ();