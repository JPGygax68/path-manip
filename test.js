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
        it('acts as a factory when called without the new operator', function() {
            var p = Path('foo/bar');
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
        it('called with a "climb" segment on an empty path will result in a "climbing" path', function() {
            var p = new Path();
            p.add('..');
            expect(p.toString()).to.be.equal('../');
        });
        it('called with a "climb" segment on a "climbing" path will result in a path climbing 2 levels', function() {
            var p = new Path();
            p.add('..').add('..');
            expect(p.toString()).to.be.equal('../../');
        });
        it('can be called with a path ending in a slash, which will make the path an (empty) branch', function() {
            var p = new Path();
            p.add('foo/bar/');
            expect(p.length).to.be.equal(2);
            expect(p.toString()).to.be.equal('foo/bar/');
            expect(p.isBranch()).to.be.true;
        });
        it('can be called with an array of segments', function() {
            var p = new Path('foo/bar');
            p.add(['..', 'baz']);
            expect(p.toString()).to.be.equal('foo/baz');
        });
        it('can take another path for argument', function() {
            var p1 = Path('foo/bar'), p2 = Path('baz/bleep');
            p1.add(p2);
            expect(p1.toString()).to.be.equal('foo/bar/baz/bleep');
        });
        it('will refuse to add an absolute segment or path to a non-empty path', function() {
            var p = Path('foo');
            var fn = function() { p.add('/bar'); }
            expect(fn).to.throw(Error);
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
    
    describe('#isAbsolute', function() {
        it('says whether or not the path starts with a slash (= is absolute)', function() {
            var p = Path('/foo/bar');
            expect(p.isAbsolute()).to.be.true;
            expect(p.toString()).to.be.equal('/foo/bar');
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
        it('with levels > current length of the path will result in a "climbing" path', function() {
            var p = new Path('foo/bar');
            p.up(3);
            expect(p.toString()).to.be.equal('../');
        });
    });
    
    describe('#makeBranch', function() {
        it('makes the segment at the end of path into a branch', function() {
            var p = new Path('foo/bar');
            p.makeBranch();
            expect(p.toString()).to.be.equal('foo/bar/');
            expect(p.isBranch()).to.be.true;
        });
    });
    
    describe('#makeLeaf', function() {
        it('makes the segment at the end of path into a leaf', function() {
            var p = new Path('foo/bar/baz');
            p.up();
            expect(p.isBranch()).to.be.true;
            p.makeLeaf();
            expect(p.toString()).to.be.equal('foo/bar');
            expect(p.isLeaf()).to.be.true;
        });
    });
    
    describe('#commonRoot (static method)', function() {
        it('produces a path containing the common root of two paths', function() {
            var p1 = new Path('foo/bar'), p2 = new Path('foo/baz');
            expect(Path.commonRoot(p1, p2).toString()).to.be.equal('foo/');
        });
        it('accepts a string for either parameter, or both', function() {
            expect(Path.commonRoot('foo/bar/baz', 'foo/bar/bleep/burp').toString()).to.be.equal('foo/bar/');
        });
    });
    
    describe('chaining:', function() {
        it('actions can be chained (add, up, makeBranch)', function() {
            var p = new Path('foo');
            p.add('bar').up().add('baz').add('beep').makeBranch().up().add('burp').makeLeaf();
            expect(p.toString()).to.be.equal('foo/baz/burp');
        });
    });
    
//});

