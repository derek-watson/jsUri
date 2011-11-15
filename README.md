jsUri
=====

Uri and query string manipulation in javascript.

This project incorporates the excellent [parseUri](http://blog.stevenlevithan.com/archives/parseuri) regular expression library by Steven Levithan. You can safely parse URLs of all shapes and sizes, however invalid or hideous.


Basic Usage
-----------

Pass anything that your browser would recognize as a url to the new Uri() constructor

    var uri = new Uri('http://user:pass@www.test.com:81/index.html?q=books#fragment');

and then use the following accessor methods to get at the various parts.

    uri.protocol();                              // http
    uri.userInfo();                              // user:pass
    uri.host();                                  // www.test.com
    uri.port();                                  // 81
    uri.path();                                  // /index.html
    uri.query();                                 // q=books
    uri.anchor();                                // fragment

The accessor methods accept an optional value for setting the property

    uri.protocol('https');
    uri.toString();                              // https://user:pass@www.test.com:81/index.html?q=books#fragment

    uri.host('mydomain.com');
    uri.toString();                              // https://user:pass@www.mydomain.com:81/index.html?q=books#fragment


Fluent Manipulation
-------------------

The fluent interface provides a simple way to chain property assignment

    new Uri()
        .setPath('/index.html')
        .setAnchor('content')
        .setHost('www.test.com')
        .setPort(8080)
        .setUserInfo('username:password')
        .setProtocol('https')
        .setQuery('this=that&some=thing')      // https://username:password@www.test.com:8080/index.html?this=that&some=thing#content

    new Uri('http://www.test.com')
        .setHost('www.yahoo.com')
        .setProtocol('https')                  // https://www.yahoo.com

    new Uri()
        .setPath('/archives/1979/')
        .setQuery('?page=1')                   // /archives/1979?page=1

Query Parameter Access and Manipulation
---------------------------------------

Special methods are available for fetching, building and modifying query string parameters. An emhpasis is placed on query string integrity; duplicate parameter names and values are preserved. Parameter ordering is preserved when possible. URI Components are decoded for comparision, but are otherwise left in their original state.

### Getting query param values by name

Returns the first query param value for the key

    new Uri('?cat=1&cat=2&cat=3').getQueryParamValue('cat')             // 1

Returns all query param values the key

    new Uri('?cat=1&cat=2&cat=3').getQueryParamValues('cat')            // [1, 2, 3]

### Adding query param values

    new Uri().addQueryParam('q', 'books')                         // ?q=books

    new Uri('http://www.github.com')
        .addQueryParam('testing', '123')
        .addQueryParam('one', 1)                                    // http://www.github.com/?testing=123&one=1

    // insert param at index 0
    new Uri('?b=2&c=3&d=4').addQueryParam('a', '1', 0)            // ?a=1&b=2&c=3&d=4

### Replacing query param values

Replaces every query string parameter named `key` with a single instance with the value `newVal`. If `oldValue` is supplied, only parameters valued `oldVal` will be replaced.

    new Uri('?a=1&b=2&c=3')
        .replaceQueryParam('a', 'eh')          // ?a=eh&b=2&c=3

    new Uri('?a=1&b=2&c=3&c=4&c=5&c=6')
        .replaceQueryParam('c', 'five', '5')   // ?a=1&b=2&c=3&c=4&c=five&c=6

    new Uri().replaceQueryParam('page', 2)   // ?page=2


### Deleting query param values

Removes instances of query parameters named `key`. If `value` is passed, only params named `key` and valued `value` will be deleted.

    new Uri('?a=1&b=2&c=3')
        .deleteQueryParam('a')                 // ?b=2&c=3

    new Uri('test.com?a=1&b=2&c=3&a=eh')
        .deleteQueryParam('a', 'eh')           // test.com/?a=1&b=2&c=3


Object Cloning
--------------

Duplication (via `.clone()`) is an easy way to inflate an identical uri object, which you can muck around with as much as you like without destroying the original.

    var baseUri = new Uri('http://localhost/');

        baseUri.clone().setProtocol('https');  // https://localhost/
        baseUri;                               // http://localhost/

Testing
-------

There is a comprensive set of unit tests written in [jasmine](http://pivotal.github.com/jasmine/). 
To run them, simply open `testrunner.html` from the root of the project in a browser.

License
-------

Copyright (c) 2011 Derek Watson
Copyright (c) 2007 Steven Levithan

Permission is hereby granted, free of charge, to any person obtaining a 
copy of this software and associated documentation files (the "Software"), 
to deal in the Software without restriction, including without limitation 
the rights to use, copy, modify, merge, publish, distribute, sublicense, 
and/or sell copies of the Software, and to permit persons to whom the 
Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included 
in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS 
OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL 
THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER 
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER 
DEALINGS IN THE SOFTWARE.
