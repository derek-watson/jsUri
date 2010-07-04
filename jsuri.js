/*
    Copyright (c) 2010 Derek Watson
    Copyright (c) 2007 Steven Levithan

    Permission is hereby granted, free of charge, to any person obtaining a copy
    of this software and associated documentation files (the "Software"), to deal
    in the Software without restriction, including without limitation the rights
    to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
    copies of the Software, and to permit persons to whom the Software is
    furnished to do so, subject to the following conditions:

    The above copyright notice and this permission notice shall be included in
    all copies or substantial portions of the Software.

    THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
    IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
    FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
    AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
    LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
    OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
    THE SOFTWARE.
*/

/*
    jsUri
    version 1.0.0

    uri parsing, manipulation and stringification

    This software incorporates MIT-licence dcode from parseUri (http://blog.stevenlevithan.com/archives/parseuri).
*/

jsUri = function (s) {
    this._uri = this.parseUri(s);
    this._query = new jsUri.query(this._uri.query);
}

jsUri.options = {
    strictMode: false,
    key: ["source", "protocol", "authority", "userInfo", "user", "password", "host", "port", "relative", "path", "directory", "file", "query", "anchor"],
    q: {
        name: "queryKey",
        parser: /(?:^|&)([^&=]*)=?([^&]*)/g
    },
    parser: {
        strict: /^(?:([^:\/?#]+):)?(?:\/\/((?:(([^:@]*)(?::([^:@]*))?)?@)?([^:\/?#]*)(?::(\d*))?))?((((?:[^?#\/]*\/)*)([^?#]*))(?:\?([^#]*))?(?:#(.*))?)/,
        loose: /^(?:(?![^:@]+:[^:@\/]*@)([^:\/?#.]+):)?(?:\/\/)?((?:(([^:@]*)(?::([^:@]*))?)?@)?([^:\/?#]*)(?::(\d*))?)(((\/(?:[^?#](?![^?#\/]*\.[^?#\/.]+(?:[?#]|$)))*\/?)?([^?#\/]*))(?:\?([^#]*))?(?:#(.*))?)/
    }
};

jsUri.prototype = {};

// parseUri(str) parses the supplied uri and returns an object containing its components
jsUri.prototype.parseUri = function(str) {
    var o = jsUri.options,
		m = o.parser[o.strictMode ? "strict" : "loose"].exec(str),
		uri = {},
		i = 14;

    while (i--) uri[o.key[i]] = m[i] || "";

    uri[o.q.name] = {};
    uri[o.key[12]].replace(o.q.parser, function ($0, $1, $2) {
        if ($1) uri[o.q.name][$1] = $2;
    });

    return uri;
}

// toString() stringifies the current state of the uri
jsUri.prototype.toString = function () {

    var s = '';
    var is = function (s) { return (s != null && s != ''); }

    if (is(this.protocol)) {
        s += this.protocol;
        if (this.protocol.indexOf(':') != this.protocol.length - 1) {
            s += ':';
        }
        s += '//';
    }
    else {
        if (this.hasAuthorityPrefix && is(this.host))
            s += '//';
    }

    if (is(this.userInfo) && is(this.host)) {
        s += this.userInfo;
        if (this.userInfo.indexOf('@') != this.userInfo.length - 1)
            s += '@';
    }

    if (is(this.host)) {
        s += this.host;
        if (is(this.port)) 
            s += ':' + this.port;
    }

    if (is(this.path))
        s += this.path;
    else
        if (is(this.host) && (is(this.query.toString()) || is(this.anchor)))
            s += '/';

    if (is(this.query.toString())) {
        if (this.query.toString().indexOf('?') != 0)
            s += '?';
        s += this.query.toString();
    }

    if (is(this.anchor)) {
        if (this.anchor.indexOf('#') != 0)
            s += '#';
        s += this.anchor;
    }

    return s;
}

/*
    Property accessor methods for jsUri
*/

jsUri.prototype.__defineGetter__('protocol', function () { return this._uri.protocol; });
jsUri.prototype.__defineSetter__('protocol', function (val) { this._uri.protocol = val; });

// hasAuthorityPrefix: if there is no protocol, the leading // can be enabled or disabled
jsUri.prototype.__defineGetter__('hasAuthorityPrefix', function () { 
    if (this._hasAuthorityPrefix == null)
    return (this._uri.source.indexOf('//') != -1);

    return this._hasAuthorityPrefix;
});
jsUri.prototype.__defineSetter__('hasAuthorityPrefix', function (val) {  this._hasAuthorityPrefix = val; });

jsUri.prototype.__defineGetter__('userInfo', function () { return this._uri.userInfo; });
jsUri.prototype.__defineSetter__('userInfo', function (val) { this._uri.userInfo = val; });

jsUri.prototype.__defineGetter__('protocol', function () { return this._uri.protocol; });
jsUri.prototype.__defineSetter__('protocol', function (val) { this._uri.protocol = val; });

jsUri.prototype.__defineGetter__('host', function () { return this._uri.host; });
jsUri.prototype.__defineSetter__('host', function (val) { this._uri.host = val; });

jsUri.prototype.__defineGetter__('port', function () { return this._uri.port; });
jsUri.prototype.__defineSetter__('port', function (val) { this._uri.port = val; });

jsUri.prototype.__defineGetter__('path', function () { return this._uri.path; });
jsUri.prototype.__defineSetter__('path', function (val) { this._uri.path = val; });

jsUri.prototype.__defineGetter__('query', function () { return this._query; });
jsUri.prototype.__defineSetter__('query', function (val) { this._query = new jsUri.query(val); });

jsUri.prototype.__defineGetter__('anchor', function () { return this._uri.anchor; });
jsUri.prototype.__defineSetter__('anchor', function (val) { this._uri.anchor = val; });


/*
    Fluent setters for jsUri uri properties
*/

jsUri.prototype.setProtocol = function (val) {
    this.protocol = val;
    return this;
}

jsUri.prototype.setHasAuthorityPrefix = function (val) {
    this.hasAuthorityPrefix = val;
    return this;
}

jsUri.prototype.setUserInfo = function (val) {
    this.userInfo = val;
    return this;
}

jsUri.prototype.setHost = function (val) {
    this.host = val;
    return this;
}

jsUri.prototype.setPort = function (val) {
    this.port = val;
    return this;
}

jsUri.prototype.setPath = function (val) {
    this.path = val;
    return this;
}

jsUri.prototype.setQuery = function (val) {
    this.query = val;
    return this;
}

jsUri.prototype.setAnchor = function (val) {
    this.anchor = val;
    return this;
}


/*
    jsUri.query
    query string parsing, parameter manipulation and stringification
*/

jsUri.query = function (q) {
    this.params = this.parseQuery(q);
}

jsUri.query.prototype = {};

// toString() returns a string containing the current query object
jsUri.query.prototype.toString = function () {

    var s = '';
    for (var p in this.params) {
        var param = this.params[p];
        var joined = param.join('=');
        if (s.length > 0)
            s += '&';
        s += param.join('=');
    }
    return s;
}

// parseQuery(q) parses the uri query string and returns a multi-dimensional array of the components
jsUri.query.prototype.parseQuery = function (q) {

    var arr = [];

    if (q == null || q == '') 
        return arr;

    var params = q.split('&');

    for (var p in params) {
        var param = params[p];
        var keyval = param.split('=');
        arr.push([keyval[0], keyval[1]]);
    }

    return arr;
}


// deleteParam(key) removes all instances of parameters named (key) 
// deleteParam(key, val) removes all instances where the value matches (val)
jsUri.query.prototype.deleteParam = function (key, val) {

    var arr = [];

    for (var p in this.params) {
        var param = this.params[p];
        if (arguments.length == 2 && param[0] == key && param[1] == val)
            continue;
        else if (arguments.length == 1 && param[0] == key)
            continue;

        arr.push(param);
    }

    this.params = arr;
    return this;
}

// addParam(key, val) adds a name/value pair to the end of the query string
// addParam(key, val, index) adds the param at the specified position (index)
jsUri.query.prototype.addParam = function (key, val, index) {

    if (arguments.length == 3 && index != -1) {
        index = Math.min(index, this.params.length);
        this.params.splice(index, 0, [key, val]);
    }
    else if (arguments.length > 0)
        this.params.push([key, val]);
    
    return this;
}

// replaceParam(key, newVal) deletes all instances of params named (key) and replaces them with the new single value
// replaceParam(key, newVal, oldVal) deletes only instances of params named (key) with the value (val) and replaces them with the new single value
// this function attempts to preserve query param ordering
jsUri.query.prototype.replaceParam = function (key, newVal, oldVal) {

    if (arguments.length == 3) {
        var index = -1;
        for (var p in this.params) {
            var param = this.params[p];
            if (param[0] == key && param[1] == oldVal) {
                index = p;
                break;
            }
        }
        return this.deleteParam(key, oldVal).addParam(key, newVal, index);
    }
    else {
        var index = -1;
        for (var p in this.params) {
            var param = this.params[p];
            if (param[0] == key) {
                index = p;
                break;
            }
        }
        return this.deleteParam(key).addParam(key, newVal, index);
    }
}

/*
    jsUri.path
    path parsing, element manipulation and stringification
*/

