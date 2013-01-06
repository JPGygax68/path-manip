var should    = require('chai').should();
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
            expect(p == '');
        });
        it('called with non-special string argument results in Path converting back to that string', function() {
            var s = 'foo/bar';
            var p = new Path(s);
            expect(p == s);
        });
        it('backslashes are converted to forward slashes', function() {
            var s = 'foo\\bar';
            var p = new Path(s);
            expect(p == 'foo/bar');
        });
        it('can be called with an array of path segments', function() {
            var p = new Path(['foo', 'bar']);
            expect(p == 'foo/bar');
        });
    });

    describe('#add', function() {
        it('called with a string adds a new segment to the path', function() {
            var p = new Path('foo');
            p.add('bar');
            expect(p == 'foo/bar');
        });
        it('called with a "climb" segment ("..") removes the last segment of the path', function() {
            var p = new Path('foo/bar');
            p.add('..');
            expect(p == 'foo/');
        });
        it('can be called with an array of segments', function() {
            var p = new Path('foo/bar');
            p.add(['..', 'baz']);
            expect(p == 'foo/baz');
        });
    });
    
    describe('#isBranch', function() {
        it('detects slash in added segment and marks path as a branch', function() {
            var p = new Path();
            p.add('foo/');
            expect(p.isBranch());
        });
        it('automatically becomes true when a path gets truncated', function() {
            var p = new Path('foo/bar');
            p.add('..');
            expect(p.isBranch());
        });
    });
    
    describe('#up', function() {
        it('removes the last segment of the path', function() {
            var p = new Path('foo/bar');
            p.up();
            expect(p == 'foo/');
        });
        it('takes an optional argument with the number of levels to climb', function() {
            var p = new Path('foo/bar/baz');
            p.up(2);
            expect(p == 'foo/');
        });
    });
    
    describe('#makeBranch', function() {
        it('makes the leaf at the end of path into a branch', function() {
            var p = new Path('foo/bar');
            p.makeBranch();
            expect(p == 'foo/bar/');
        });
    });
    
    describe('chaining:', function() {
        it('all actions can be chained', function() {
            var p = new Path('foo');
            p.add('bar').up().add('baz');
            expect(p == 'foo/baz');
        });
    });
    
//});

