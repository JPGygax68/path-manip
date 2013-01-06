"use strict";

(function() {

if (typeof define !== 'function') var define = function() { 
    var func = arguments[arguments.length-1];
    module.exports = func();
    //for (var key in _exports) if (_exports.hasOwnProperty(key)) exports[key] = _exports[key];
};

define( function() {

    function Path(s) {
        this.segments = [];
        switch (typeof s) {
        case 'undefined': break;
        case 'string'   : this.add.call(this, s); break;
        case 'object'   : fromObject.call(this, s); break;
        }
        
        function fromObject(obj) {
            if (obj instanceof Array) this.add(obj);
            else                      throw new TypeError('Path constructor');
        }
    }
    
    Path.prototype = new Array();
    
    Path.prototype.toString = function() { 
        return this.segments.join(''); 
    }
    
    Path.prototype.add = function(path) {
        if (path instanceof Array) {
            path.forEach( function(seg, i) { 
                if (seg === '') {
                    if (i === path.length-1) this.makeBranch();
                    else console.warn('Path::add(): added path contains empty segment!');
                }
                else this.add(seg); 
            }, this );
        }
        else if (typeof path === 'string') {
            if (path == '..') {
                if (this.segments.length > 0) this.segments.pop();
                else                          this.segments.push( '../' );
            }
            else {
                var segs = path.replace('\\', '/').split('/');
                if (segs.length > 1) {
                    this.add(segs);
                }
                else  {
                    this.makeBranch();
                    this.segments.push(path);
                }
            }
        }
        else throw new TypeError('Path::add()');
    }
    
    Path.prototype.isBranch = function() { 
        if (this.segments.length === 0) return false;
        var last_seg = this.segments[this.segments.length-1];
        return last_seg[last_seg.length-1] === '/';
    }
    
    Path.prototype.makeBranch = function() {
        if (this.segments.length > 0) {
            var i = this.segments.length - 1;
            if (lastChar(this.segments[i]) !== '/') this.segments[i] += '/';
        }
    }
    
    Path.prototype.up = function(levels) {
        levels = levels || 1;
        if (this.segments.length >= levels) this.segments.splice(this.segments.length - levels, levels);
    }
    
    return Path;
    
    //--------------
    
    function lastChar(s) { return s[s.length-1]; }
});

}) ();