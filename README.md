jsUri
=====

Uri parsing, modification, query string manipulation and high-fidelity re-stringification in javascript.

This project incorporates the excellent [parseUri](http://blog.stevenlevithan.com/archives/parseuri) regular expression library by Steven Levithan. You can safely parse URLs of all shapes and sizes by passing them to the object constructor...


Basic Usage
-----------

Parsing

    var uri = new jsUri('http://user:pass@www.test.com:81/index.html?q=books#fragment');

Getting 

    uri.protocol();                              // http
    uri.userInfo();                              // user:pass
    uri.host();                                  // www.test.com
    uri.port();                                  // 81
    uri.path();                                  // /index.html
    uri.query();                                 // q=books
    uri.anchor();                                // fragment

Setting

    uri.protocol('https');
    uri.toString();                              // https://user:pass@www.test.com:81/index.html?q=books#fragment

    uri.host('mydomain.com');
    uri.toString();                              // https://user:pass@www.mydomain.com:81/index.html?q=books#fragment


Fluent Manipulation
-------------------

The fluent interface provides a simple way to chain property assignment

    new jsUri()
        .setPath('/index.html')
        .setAnchor('content')
        .setHost('www.test.com')
        .setPort(8080)
        .setUserInfo('username:password')
        .setProtocol('https')
        .setQuery('this=that&some=thing')      // https://username:password@www.test.com:8080/index.html?this=that&some=thing#content

    new jsUri('http://www.test.com')
        .setHost('www.yahoo.com')
        .setProtocol('https')                  // https://www.yahoo.com

    new jsUri()
        .setPath('/archives/1979/')
        .setQuery('?page=1')                   // /archives/1979?page=1

Query Parameter Access and Manipulation
---------------------------------------

Special methods are available for fetching, building and modifying query string parameters. An emhpasis is placed on query string integrity; duplicate parameter names and values are preserved. Parameter ordering is preserved when possible. URI Components are decoded for comparision, but are otherwise left in their original state.

`getQueryParamValue(key)`

Returns the first query param value found for the key matching `key`

    new jsUri('?cat=1&cat=2&cat=3')
        .getQueryParamValue('cat')             // 1

`getQueryParamValues(key)`

Returns an array of query param values found for the key matching `key`

    new jsUri('?cat=1&cat=2&cat=3')
        .getQueryParamValue('cat')             // [1, 2, 3]


`addQueryParam(key, value[, index])`

Adds an element to the end of the list of query parameters.

    new jsUri().addQueryParam('q', 'books')    // ?q=books

    new jsUri('http://www.microsoft.com')
        .addQueryParam('testing', '123')
        .addQueryParam('one', 1)               // http://www.microsoft.com/?testing=123&one=1


    // add a=1 to index 0 (prepend)
    new jsUri('?b=2&c=3&d=4')
        .addQueryParam('a', '1', 0)            // ?a=1&b=2&c=3&d=4

`replaceQueryParam(key, newVal[, oldVal])`

Replaces every query string parameter named `key` with a single instance with the value `newVal`. If `oldValue` is supplied, only parameters valued `oldVal` will be replaced.

    new jsUri('?a=1&b=2&c=3')
        .replaceQueryParam('a', 'eh')          // ?a=eh&b=2&c=3

    new jsUri('?a=1&b=2&c=3&c=4&c=5&c=6')
        .replaceQueryParam('c', 'five', '5')   // ?a=1&b=2&c=3&c=4&c=five&c=6

    new jsUri().replaceQueryParam('page', 2)   // ?page=2


`deleteQueryParam(key[, value])`

Removes instances of query parameters named `key`. If `value` is passed, only params named `key` and valued `value` will be deleted.

    new jsUri('?a=1&b=2&c=3')
        .deleteQueryParam('a')                 // ?b=2&c=3

    new jsUri('test.com?a=1&b=2&c=3&a=eh')
        .deleteQueryParam('a', 'eh')           // test.com/?a=1&b=2&c=3


Object Cloning
--------------

Duplication (via `.clone()`) is an easy way to inflate an identical uri object, which you can muck around with as much as you like without destroying the original.

    var baseUri = new jsUri(http://localhost/);

        baseUri.clone().setProtocol(https);    // https://localhost/
        baseUri;                               // http://localhost/
