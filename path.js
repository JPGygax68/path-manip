"use strict";

(function() {

if (typeof define !== 'function') var define = function() { 
    var func = arguments[arguments.length-1];
    module.exports = func();
    //for (var key in _exports) if (_exports.hasOwnProperty(key)) exports[key] = _exports[key];
};

define( function() {

    function Path(s) {
        if (!(this instanceof Path)) {
            var instance = new Path();
            Path.apply(instance, arguments);
            return instance;
        }
        else {        
            if (typeof s !== 'undefined') this.add(s);
        }
        
        function fromObject(obj) {
            if (obj instanceof Array) this.add(obj);
            else                      throw new TypeError('Path constructor');
        }
    }
    
    Path.prototype = new Array();
    Path.prototype.constructor = Path;
    
    Path.prototype.toString = function() { 
        return this.join(''); 
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
                if (this.length > 0 && lastElement(this) !== '../') this.pop();
                else                                                this.push('../');
            }
            else {
                path = path.replace('\\', '/');
                if (path[0] === '/') {
                    if (this.length > 0) throw new Error('Path::add(): trying to add absolute path to non-empty path');
                    var segs = path.slice(1).split('/');
                    this.push('/' + segs[0]);
                    if (segs.length > 0) { segs.shift(); this.add(segs); }
                }
                else {
                    var segs = path.split('/');
                    if (segs.length > 1) {
                        this.add(segs);
                    }
                    else  {
                        this.makeBranch();
                        this.push(path);
                    }
                }
            }
        }
        else throw new TypeError('Path::add()');
        return this;
    }
    
    Path.prototype.isBranch = function() { 
        if (this.length === 0) return;
        var last_seg = this[this.length-1];
        return lastChar(last_seg) === '/';
    }
    
    Path.prototype.isLeaf = function() {
        if (this.length === 0) return;
        var last_seg = this[this.length-1];
        return lastChar(last_seg) !== '/';
    }

    Path.prototype.isAbsolute = function() {
        if (this.length === 0) return;
        return this[0][0] === '/';
    }
    
    Path.prototype.makeBranch = function() {
        if (this.length > 0) {
            var i = this.length - 1;
            if (lastChar(this[i]) !== '/') this[i] += '/';
        }
    }
    
    Path.prototype.up = function(levels) {
        levels = levels || 1;
        var remove = levels > this.length ? this.length : levels;
        if (remove > 0) { this.splice(this.length - remove, levels); levels -= remove; }
        for (var i = 0; i < levels; i ++) this.add('../');
        return this;
    }
    
    //Path.prototype.length = function() { return this.length; }
    
    Path.prototype.at = function(i) { return this[i]; }
    
    Path.commonRoot = function(p1, p2) {
        if (typeof p1 === 'string') p1 = new Path(p1);
        if (typeof p2 === 'string') p2 = new Path(p2);
        var root = new Path();
        for (var i = 0; i < p1.length && i < p2.length; i++) {
            if (p1.at(i) !== p2.at(i)) break;
            root.add( p1.at(i) );
        }
        return root;
    }
    
    return Path;
    
    //--------------
    
    function lastElement(a) { return a[a.length-1]; }
    function lastChar   (s) { return s[s.length-1]; }
});

}) ();