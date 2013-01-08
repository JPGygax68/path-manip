Path-manip: a simple but convenient library for path manipulation
=================================================================

What is is
----------

This very small library tries to fill to the need for easier manipulation of filesystem/filesystem-like paths - no less, no more.

Here's a list of the things it is *NOT*:

- It is not an abstraction layer to hide differences between Windows and Un*x. In fact, it does not presently contain any functionality to that effect, other than to automatically convert backslashes to forward slashes (it won't even convert them back!)

- It is not a pattern-matching library (no file "globbing" here)

- It is not a "file system" library in any sense; it only works with paths.


Importing the package
---------------------

This package supports both the CommonJS (synchronous) and the AMD (asynchronous) forms of importing. So, for Node:

	var Path = require('path-manip');
   
and for the browser (or any other AMD environment):

	require(['path-manip'], function(Path) {
		...
	});
	
(Of course with AMD, it could be either `require` or `define`.)


A few comments
--------------

The `Path` class is derived from `Array`, so it inherits all of its methods. In particular, this means that the `length` property can be used to obtain the number of segments composing the path, that individual segments can be access through the index operator `[i]`, and that the `forEach()` method can be used to iterate over segments. 
(Note: the root of an absolute path is *not* considered a segment it itself - this may change in the future though, I haven't yet thought this through. Comments welcome.)

While the above examples can be used safely, it is not generally a very good idea to use Array methods such as `shift()`, `unshift()`, `push()` and `pop()` to manipulate paths, as these methods will not be aware that they are working on path segments and fail to handle special cases correctly (this may be improved upon in future versions).

Reference
---------

No reference is provided here. I suggest you just quickly glance over the source, which is quite short and where every method is properly commented. But if you prefer to get your information from a nicely formatted document, you can obtain one quickly and easily by installing and running yuidoc: (`npm install -g yuidoc`, then `yuidoc .` - done, you can now access the docs by loading the file `./out/index.html` into your browser).