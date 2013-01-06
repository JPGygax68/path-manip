"use strict";

(function() {

if (typeof define !== 'function') var define = function() { 
    var func = arguments[arguments.length-1];
    module.exports = func();
    //for (var key in _exports) if (_exports.hasOwnProperty(key)) exports[key] = _exports[key];
};

define( function() {

    function Path(s) {
        switch (typeof s) {
        case 'undefined': this.segments = []; break;
        case 'string'   : this.segments = s.replace('\\', '/').split('/'); break;
        case 'object'   : fromObject.call(this, s); break;
        }
        
        function fromObject(obj) {
            if (obj instanceof Array) this.segments = obj.map( function(seg) { return seg; } );
            else                      throw new TypeError('Path() constructor: unsupported argument type');
        }
    }
    
    Path.prototype = new Array();
    
    Path.prototype.toString = function() { return this.segments.join('/'); }
    
    return Path;
});

}) ();