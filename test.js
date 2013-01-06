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
            expect(p == '').to.be.ok;
        });
        it('called with non-special string argument results in Path converting back to that string', function() {
            var s = 'foo/bar';
            var p = new Path(s);
            expect(p == s).to.be.ok;
        });
        it('backslashes are converted to forward slashes', function() {
            var s = 'foo\\bar';
            var p = new Path(s);
            expect(p == 'foo/bar').to.be.ok;
        });
        it('can be called with an array of path segments', function() {
            var p = new Path(['foo', 'bar']);
            expect(p == 'foo/bar').to.be.ok;
        });
    });

    describe('#add', function() {
        it('called with a string adds a new segment to the path', function() {
            var p = new Path('foo');
            p.add('bar');
            expect(p == 'foo/bar').to.be.ok;
        });
        it('called with a "climb" segment ("..") removes the last segment of the path', function() {
            var p = new Path('foo/bar');
            p.add('..');
            expect(p == 'foo/').to.be.ok;
        });
        it('can be called with an array of segments', function() {
            var p = new Path('foo/bar');
            p.add(['..', 'baz']);
            expect(p == 'foo/baz').to.be.ok;
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
    });
    
    describe('#up', function() {
        it('removes the last segment of the path', function() {
            var p = new Path('foo/bar');
            p.up();
            expect(p == 'foo/').to.be.true;
        });
        it('takes an optional argument with the number of levels to climb', function() {
            var p = new Path('foo/bar/baz');
            p.up(2);
            expect(p == 'foo/').to.be.true;
        });
    });
    
//});

