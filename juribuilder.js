/*
    Copyright (c) 2010 Derek Watson
    Copyright (c) 2007 Steven Levithan

    This program is free software: you can redistribute it and/or modify
    it under the terms of the GNU General Public License as published by
    the Free Software Foundation, either version 3 of the License, or
    (at your option) any later version.

    This program is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
    GNU General Public License for more details.

    You should have received a copy of the GNU General Public License
    along with this program. If not, see <http://www.gnu.org/licenses/>.
*/

/*
    version 1.0.0
    2010 Derek Watson

    jUriBuilder
    uri parsing, manipulation and stringification

    This software incorporates MIT-licence dcode from parseUri (http://blog.stevenlevithan.com/archives/parseuri).
*/

juribuilder = function (s) {
    this._uri = this.parseUri(s);
    this._query = new juribuilder.query(this._uri.query);
}

juribuilder.options = {
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

juribuilder.prototype = {};

// parseUri(str) parses the supplied uri and returns an object containing its components
juribuilder.prototype.parseUri = function(str) {
    var o = juribuilder.options,
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
juribuilder.prototype.toString = function () {

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
    Property accessor methods for juribuilder
*/

juribuilder.prototype.__defineGetter__('protocol', function () { return this._uri.protocol; });
juribuilder.prototype.__defineSetter__('protocol', function (val) { this._uri.protocol = val; });

// hasAuthorityPrefix: if there is no protocol, the leading // can be enabled or disabled
juribuilder.prototype.__defineGetter__('hasAuthorityPrefix', function () { 
    if (this._hasAuthorityPrefix == null)
    return (this._uri.source.indexOf('//') != -1);

    return this._hasAuthorityPrefix;
});
juribuilder.prototype.__defineSetter__('hasAuthorityPrefix', function (val) {  this._hasAuthorityPrefix = val; });

juribuilder.prototype.__defineGetter__('userInfo', function () { return this._uri.userInfo; });
juribuilder.prototype.__defineSetter__('userInfo', function (val) { this._uri.userInfo = val; });

juribuilder.prototype.__defineGetter__('protocol', function () { return this._uri.protocol; });
juribuilder.prototype.__defineSetter__('protocol', function (val) { this._uri.protocol = val; });

juribuilder.prototype.__defineGetter__('host', function () { return this._uri.host; });
juribuilder.prototype.__defineSetter__('host', function (val) { this._uri.host = val; });

juribuilder.prototype.__defineGetter__('port', function () { return this._uri.port; });
juribuilder.prototype.__defineSetter__('port', function (val) { this._uri.port = val; });

juribuilder.prototype.__defineGetter__('path', function () { return this._uri.path; });
juribuilder.prototype.__defineSetter__('path', function (val) { this._uri.path = val; });

juribuilder.prototype.__defineGetter__('query', function () { return this._query; });
juribuilder.prototype.__defineSetter__('query', function (val) { this._query = new juribuilder.query(val); });

juribuilder.prototype.__defineGetter__('anchor', function () { return this._uri.anchor; });
juribuilder.prototype.__defineSetter__('anchor', function (val) { this._uri.anchor = val; });


/*
    Fluent setters for juribuilder uri properties
*/

juribuilder.prototype.setProtocol = function (val) {
    this.protocol = val;
    return this;
}

juribuilder.prototype.setHasAuthorityPrefix = function (val) {
    this.hasAuthorityPrefix = val;
    return this;
}

juribuilder.prototype.setUserInfo = function (val) {
    this.userInfo = val;
    return this;
}

juribuilder.prototype.setHost = function (val) {
    this.host = val;
    return this;
}

juribuilder.prototype.setPort = function (val) {
    this.port = val;
    return this;
}

juribuilder.prototype.setPath = function (val) {
    this.path = val;
    return this;
}

juribuilder.prototype.setQuery = function (val) {
    this.query = val;
    return this;
}

juribuilder.prototype.setAnchor = function (val) {
    this.anchor = val;
    return this;
}


/*
    jUriBuilder.query
    query string parsing, parameter manipulation and stringification
*/

juribuilder.query = function (q) {
    this.params = this.parseQuery(q);
}

juribuilder.query.prototype = {};

// toString() returns a string containing the current query object
juribuilder.query.prototype.toString = function () {

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
juribuilder.query.prototype.parseQuery = function (q) {

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
juribuilder.query.prototype.deleteParam = function (key, val) {

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
juribuilder.query.prototype.addParam = function (key, val, index) {

    if (arguments.length == 3) {
        index = Math.min(index, this.params.length);
        this.params.splice(index, 0, [key, val]);
    }
    else if (arguments.length > 0)
        this.params.push([key, val]);
    
    return this;
}


/*
    jUriBuilder.path
    path parsing, element manipulation and stringification
*/

