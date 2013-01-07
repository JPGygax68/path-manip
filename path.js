"use strict";

(function() {

if (typeof define !== 'function') var define = function() { 
    var func = arguments[arguments.length-1];
    module.exports = func();
    //for (var key in _exports) if (_exports.hasOwnProperty(key)) exports[key] = _exports[key];
};

define( function() {

    /** 
     * @class Path
     * @constructor
     * @param {String|Array|Path} [path] Describes the path: can be a string, an array of path segments or another
           Path object. If empty or omitted, the path object will be created empty.  
           Note: this constructor can be called without the `new` operator.
     */
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
    
    /** 
     * Converts the path to a string. The string will begin with a slash if the path is absolute, and
     * end in a slash if the path is a branch.
     *
     * @method toString
     */
    Path.prototype.toString = function() { 
        return this.join(''); 
    }
    
    /**
     *  Adds one more new segments to the path.
     *  @method add
     *  @return this    Returns the Path object it was called on, providing for chaining.
     *  @param {String|Array|Path} subpath  Segment or segments to append to the path.
            `subpath` can be a string describing the path to append, an array of segments
            (or subpath strings containing several slash-delimited segments), or another `Path` object.  
            Please note:  
            (1) A string subpath can start with slash, but only if the path object it is being
            appended to is empty at that point - otherwise an error will be thrown.  
            (2) Subpaths ending in a slash will mark the path as being a *branch* (see `isBranch`)  
            (3) Adding a segment to a path ending in a *leaf* (that is, a segment *not* ending 
                in a slash) will act as if that last segment was a branch (that is, the separating
                slash will be inserted automatically).  
            (4) `add`ing an array or Path object is strictly equivalent to adding each of its members 
                (or segments).  
            (5) a segment consisting of two dots ("..") will be interpreted in the same way as
                if `up()` were called (see the `up` method).
     */
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
    
    /**
        Checks whether the last segment of the path ends with a slash.  
        Note that this method may return `undefined` if the path is empty.
        @method isBranch
        @return {Boolean|undefined}
     */
    Path.prototype.isBranch = function() { 
        if (this.length === 0) return;
        var last_seg = this[this.length-1];
        return lastChar(last_seg) === '/';
    }
    
    /**
        Counterpart to `isBranch()`. Returns `true` if the last segment does *not* end with a slash,
        and will also return `undefined` if the path is empty.
        @method isLeaf
        @return {Boolean|undefined}
     */
    Path.prototype.isLeaf = function() {
        if (this.length === 0) return;
        var last_seg = this[this.length-1];
        return lastChar(last_seg) !== '/';
    }

    /**
        Checks whether the first segment begins with a slash.  
        Note: this method really only looks at the initial slash, and does not attempt
        to detect Windows-style roots like `"C:\"`.
        @method isAbsolute
     */
    Path.prototype.isAbsolute = function() {
        if (this.length === 0) return;
        return this[0][0] === '/';
    }
    
    /**
        Makes the path into a branch (if it wasn't already).
        @method makeBranch
        @return this    Returns the Path object it was called on, providing for chaining.
     */
    Path.prototype.makeBranch = function() {
        if (this.length > 0) {
            var i = this.length - 1;
            if (lastChar(this[i]) !== '/') this[i] += '/';
        }
    }
    
    /**
        Removes the last segment of the path, or adds a "climbing" segment ("..") if 
        the path was empty or already ending in a climbing segment.
        @method up
        @param {Integer} [levels]     Number of levels to "climb" (default: 1)
        @return this    Returns the Path object it was called on, providing for chaining.
      */
    Path.prototype.up = function(levels) {
        levels = levels || 1;
        var remove = levels > this.length ? this.length : levels;
        if (remove > 0) { this.splice(this.length - remove, levels); levels -= remove; }
        for (var i = 0; i < levels; i ++) this.add('../');
        return this;
    }
    
    /**
        Finds the common stem of two paths.  
        (This is a static method, call it like this: `Path.commonRoot(aPath, anotherPath)`)
        @method commonRoot
        @static
        @param {Path|String} path1  First path
        @param {Path|String} path2  Second path
        @return {Path} common       Path containing initial segments common to both paths.
     */
    Path.commonRoot = function(p1, p2) {
        if (typeof p1 === 'string') p1 = new Path(p1);
        if (typeof p2 === 'string') p2 = new Path(p2);
        var root = new Path();
        for (var i = 0; i < p1.length && i < p2.length; i++) {
            if (p1[i] !== p2[i]) break;
            root.add( p1[i] );
        }
        return root;
    }
    
    return Path;
    
    //--------------
    
    function lastElement(a) { return a[a.length-1]; }
    function lastChar   (s) { return s[s.length-1]; }
});

}) ();