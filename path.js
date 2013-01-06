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
            this._segments = [];
            switch (typeof s) {
            case 'undefined': break;
            case 'string'   : this.add.call(this, s); break;
            case 'object'   : fromObject.call(this, s); break;
            }
        }
        
        function fromObject(obj) {
            if (obj instanceof Array) this.add(obj);
            else                      throw new TypeError('Path constructor');
        }
    }
    
    Path.prototype.toString = function() { 
        return this._segments.join(''); 
    }
    
    Path.prototype.add = function(path) {
        if (path instanceof Path) {
            this.add( path._segments );
        }
        else if (path instanceof Array) {
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
                if (this._segments.length > 0) this._segments.pop();
                else                           this._segments.push('../');
            }
            else {
                path = path.replace('\\', '/');
                if (path[0] === '/') {
                    if (this._segments.length > 0) throw new Error('Path::add(): trying to add absolute path to non-empty path');
                    var segs = path.slice(1).split('/');
                    this._segments.push('/' + segs[0]);
                    if (segs.length > 0) { segs.shift(); this.add(segs); }
                }
                else {
                    var segs = path.split('/');
                    if (segs.length > 1) {
                        this.add(segs);
                    }
                    else  {
                        this.makeBranch();
                        this._segments.push(path);
                    }
                }
            }
        }
        else throw new TypeError('Path::add()');
        return this;
    }
    
    Path.prototype.isBranch = function() { 
        if (this._segments.length === 0) return;
        var last_seg = this._segments[this._segments.length-1];
        return lastChar(last_seg) === '/';
    }
    
    Path.prototype.isLeaf = function() {
        if (this._segments.length === 0) return;
        var last_seg = this._segments[this._segments.length-1];
        return lastChar(last_seg) !== '/';
    }

    Path.prototype.isAbsolute = function() {
        if (this._segments.length === 0) return;
        return this._segments[0][0] === '/';
    }
    
    Path.prototype.makeBranch = function() {
        if (this._segments.length > 0) {
            var i = this._segments.length - 1;
            if (lastChar(this._segments[i]) !== '/') this._segments[i] += '/';
        }
    }
    
    Path.prototype.up = function(levels) {
        levels = levels || 1;
        if (this._segments.length >= levels) this._segments.splice(this._segments.length - levels, levels);
        return this;
    }
    
    Path.prototype.length = function() { return this._segments.length; }
    
    Path.prototype.at = function(i) { return this._segments[i]; }
    
    Path.prototype.forEach = function(callback) { this._segments.forEach(callback, this); }
    
    Path.commonRoot = function(p1, p2) {
        if (typeof p1 === 'string') p1 = new Path(p1);
        if (typeof p2 === 'string') p2 = new Path(p2);
        var root = new Path();
        for (var i = 0; i < p1._segments.length && i < p2._segments.length; i++) {
            if (p1.at(i) !== p2.at(i)) break;
            root.add( p1.at(i) );
        }
        return root;
    }
    
    return Path;
    
    //--------------
    
    function lastChar(s) { return s[s.length-1]; }
});

}) ();