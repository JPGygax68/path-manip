Path.js: a simple but convenient library for path manipulation
==============================================================

Synopsis
--------

This very small library tries to fill to the need for easier manipulation of filesystem/filesystem-like paths - no less, no more.

Here's a list of the things it is *NOT*:

- It is not an abstraction layer to hide differences between Windows and Un*x. In fact, it does not presently contain any functionality to that effect, other than to automatically convert backslashes to forward slashes (it won't even convert them back!)

- It is not a pattern-matching library (no file "globbing" here)

- It is not a "file system" library in any sense; it only works with paths.


Importing the package
---------------------

Path.js supports both the CommonJS (synchronous) and the AMD (asynchronous) forms of `require`. So, for Node:

	var Path = require('path');
   
and for the browser (or any other AMD environment):

	require(['path'], function(Path) {
		...
	});
	
(Of course with AMD, it could be either `require` or `define`.)


Usage
-----

`Path` 

is the constructor function returned by the `require` mechanism (which means you could give it a different name, yet I suggest you go with `Path`).

You can use it with or without the "new" operator. It will work pretty much as you'd expect: it takes a single optional parameter, which if specified can be either a string, an array of strings, or another Path object.

In fact, specifying a parameter in the constructor is equivalent to building the object empty, then calling `add` with that parameter.

`add`

This is the workhorse of the class. It will accept the same types for its single parameter as the constructor does, except that the parameter is not optional here.

There are a few special cases to consider:

- `add`ing `..` (or '../') will have the same effect as calling `up(1)`, i.e. it will pop of the last segment of the path, unless said last segment is a also a climbing segment, in which case it will add the new climbing segment.