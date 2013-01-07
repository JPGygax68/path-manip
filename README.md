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


A few initial comments
----------------------

`Path` is derived from `Array`, so it inherits all of its methods. In particular, this means that the `length` property can be used to obtain the number of segments composing the path, that individual segments can be access through the index operator `[i]`, and that the `forEach()` method can be used to iterate over segments. 

While the above examples can be used safely, it is not generally a very good idea to use Array methods such as `shift()`, `unshift()`, `push()` and `pop()` to manipulate paths, as these methods will not be aware that they are working on path segments and fail to handle special cases correctly.


Usage
-----

- `Path`

	is the constructor function returned by the `require` mechanism (which means you could give it a different name, yet I suggest you go with `Path`).

	You can use it with or without the "new" operator. It will work pretty much as you'd expect: it takes a single optional parameter, which if specified can be either a string, an array of strings, or another Path object.

	In fact, specifying a parameter in the constructor is equivalent to building the object empty, then calling `add` with that parameter.

	
- `add` method

	This is the workhorse of the class. It will accept the same types for its single parameter as the constructor does, except that the parameter is not optional here.

	There are a few special cases to consider:

	+ `add`ing `..` (or `../`) will have the same effect as calling `up(1)`, i.e. it will pop of the last segment of the path. Unless, that is, the path consists of nothing but such "climbing" segments, in which `add` will simply add another "step".
	NOTE: a path ending in a climbing segment is always considered a branch.

	+ `add`ing a segment or path ending in a slash will make the resulting path a branch.

	+ `add`ing a segment *beginning* with a slash will make the path "absolute". This is only allowed on empty paths!

	
- `isBranch`, `isLeaf` methods

	Return true when the path is a branch or a leaf, respectively. Note that these methods will always return either `true` or `false`, except if the path is empty, in which case both methods won't return anything.

	
- `isAbsolute` method

	Returns true if the first segment of the path begins with a slash.

	NOTE: the notion of a path or segment being "absolute" refers to the initial slash *only*. No attempt is made to deal with Windows peculiarities. For example, constructing a path from the string `"C:\Users\Bill"` is perfectly acceptable, but will result in a path object consiting of the segments `C:/`, `Users/` and `Bill`, and the path will *not* be considered absolute (since it is missing an initial slash).

	
- `makeBranch` method

	Makes the current path into a branch.

	
- `up` method

	Equivalent to `add`ing a climbing segment (see `add`). The optional parameters specifies the number of levels to "climb" (default: 1).

- `commonRoot` *static* method (call with `Path.commonRoot(path1, path2)`)

	This static method tries to find the common stem of two path objects. Either or both of these paths can be specified as strings.
