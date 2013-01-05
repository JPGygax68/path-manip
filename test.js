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

    describe('#Construction', function() {
        it('Path created by new without params should be comparable to the empty string', function() {
            var p = new Path();
            expect(p == '').to.be.ok;
        });
    });

//});

