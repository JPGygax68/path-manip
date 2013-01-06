//var should    = require('chai').should();
var expect    = require('chai').expect;
var requirejs = require('requirejs');
var Path      = require('./path');

/* requirejs.config({
    //Pass the top-level main.js/index.js require
    //function to requirejs so that node modules
    //are loaded relative to the top-level JS file.
    nodeRequire: require
}); */

//requirejs(['./path'],
//function (    Path  ) {

    describe('#constructor', function() {
        it('called without params results in Path convertible to empty string', function() {
            var p = new Path();
            expect(p.toString()).to.be.equal('');
        });
        it('called with non-special string argument results in Path converting back to that string', function() {
            var s = 'foo/bar';
            var p = new Path(s);
            expect(p.toString()).to.be.equal(s);
        });
        it('backslashes are converted to forward slashes', function() {
            var s = 'foo\\bar';
            var p = new Path(s);
            expect(p.toString()).to.be.equal('foo/bar');
        });
        it('can be called with an array of path segments', function() {
            var p = new Path(['foo', 'bar']);
            expect(p.toString()).to.be.equal('foo/bar');
        });
    });

    describe('#add', function() {
        it('called with a string adds a new segment to the path', function() {
            var p = new Path('foo');
            p.add('bar');
            expect(p.toString()).to.be.equal('foo/bar');
        });
        it('called with a "climb" segment ("..") removes the last segment of the path', function() {
            var p = new Path('foo/bar');
            p.add('..');
            expect(p.toString()).to.be.equal('foo/');
        });
        it('can be called with an array of segments', function() {
            var p = new Path('foo/bar');
            p.add(['..', 'baz']);
            expect(p.toString()).to.be.equal('foo/baz');
        });
    });
    
    describe('#isBranch', function() {
        it('detects slash in added segment and marks path as a branch', function() {
            var p = new Path();
            p.add('foo/');
            expect(p.isBranch()).to.be.true;
        });
        it('automatically becomes true when a path gets truncated', function() {
            var p = new Path('foo/bar');
            p.add('..');
            expect(p.isBranch()).to.be.true;
        });
        it('returns "undefined" for an empty path', function() {
            var p = new Path();
            expect(p.isBranch()).to.be.equal(undefined);
        });
    });
    
    describe('#isLeaf', function() {
        it('is true after adding a standard segment', function() {
            var p = new Path();
            p.add('foo');
            expect(p.isLeaf()).to.be.true;
        });
        it('is true after adding a composite segment ending in a non-branch (= string containing slashes)', function() {
            var p = new Path();
            p.add('foo/bar');
            expect(p.isLeaf()).to.be.true;
        });
        it('returns "undefined" for an empty path', function() {
            var p = new Path();
            expect(p.isLeaf()).to.be.equal(undefined);
        });
    });
    
    describe('#up', function() {
        it('removes the last segment of the path', function() {
            var p = new Path('foo/bar');
            p.up();
            expect(p.toString()).to.be.equal('foo/');
        });
        it('takes an optional argument with the number of levels to climb', function() {
            var p = new Path('foo/bar/baz');
            p.up(2);
            expect(p.toString()).to.be.equal('foo/');
        });
    });
    
    describe('#makeBranch', function() {
        it('makes the leaf at the end of path into a branch', function() {
            var p = new Path('foo/bar');
            p.makeBranch();
            expect(p.toString()).to.be.equal('foo/bar/');
        });
    });
    
    describe('#length', function() {
        it('returns the number of segments in the path', function() {
            var p = new Path('foo/bar');
            p.add('../baz');
            expect(p.length()).to.be.equal(2);
            p.add(['beep', 'burp']);
            expect(p.length()).to.be.equal(4);
        });
    });
    
    describe('#commonRoot', function() {
        it('(static method) produces a path containing the common root of two paths', function() {
            var p1 = new Path('foo/bar'), p2 = new Path('foo/baz');
            expect(Path.commonRoot(p1, p2).toString()).to.be.equal('foo/');
        });
    });
    
    describe('chaining:', function() {
        it('actions can be chained (add, up)', function() {
            var p = new Path('foo');
            p.add('bar').up().add('baz');
            expect(p.toString()).to.be.equal('foo/baz');
        });
    });
    
//});

