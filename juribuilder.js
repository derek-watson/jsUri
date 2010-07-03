/*
* Copyright 2010 Derek Watson
* 
* juribuilder is based on the work of two other GPL-licenced javascript libraries:
*
*   parseUri http://blog.stevenlevithan.com/archives/parseuri
*   FLQ.URL - Fliquid URL building/handling class http://www.fliquidstudios.com/projects/javascript-url-library/javascript-url-library-code/
*
* This program is free software: you can redistribute it and/or modify
* it under the terms of the GNU General Public License as published by
* the Free Software Foundation, either version 3 of the License, or
* (at your option) any later version.
*
* This program is distributed in the hope that it will be useful,
* but WITHOUT ANY WARRANTY; without even the implied warranty of
* MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
* GNU General Public License for more details.
*
* You should have received a copy of the GNU General Public License
* along with this program. If not, see <http://www.gnu.org/licenses/>.
*/

/*
    juribuilder
    Version: 0.0.1
*/

juribuilder = function (url) {
    this.uri = this.parseUri(url);
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

// parseURL() parses the specified url and returns an object containing the various components
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



// toString() returns a string containing the current juribuilder object as a URL
juribuilder.prototype.toString = function () {

    var s = '';
    var is = function (s) { return (s != null && s != ''); }

    if (is(this.uri.protocol)) {
        s += this.uri.protocol;
        if (this.uri.protocol.indexOf(':') == -1) {
            s += ':';
        }
    }

    if (this.hasAuthorityPrefix) s += '//';

    if (is(this.uri.userInfo)) {
        s += this.uri.userInfo;
        if (this.uri.userInfo.indexOf('@') != this.uri.userInfo.length - 1)
            s += '@';
    }

    if (is(this.uri.host)) s += this.uri.host;
    if (is(this.uri.port)) s += ':' + this.uri.port;
    if (is(this.uri.path)) s += this.uri.path;
    if (is(this.uri.query)) s += '?' + this.uri.query;
    if (is(this.uri.anchor)) s += '#' + this.uri.anchor;

    return s;
}

// protocol: get/set the uri protocol (http, https, ftp, etc)
juribuilder.prototype.__defineGetter__('protocol', function () { return this.uri.protocol; });
juribuilder.prototype.__defineSetter__('protocol', function (val) { this.uri.protocol = val; });

// hasAuthorityPrefix: if there is no protocol, the leading // can be enabled or disabled
juribuilder.prototype.__defineGetter__('hasAuthorityPrefix', function () {
    if (this.protocol != null && this.protocol != '')
        return true;

    if (this._hasAuthorityPrefix == null || typeof (this._hasAuthorityPrefix) == 'undefined')
        return (this.uri.source.indexOf('//') != -1);

    return this._hasAuthorityPrefix;
});
juribuilder.prototype.__defineSetter__('hasAuthorityPrefix', function (val) { 
    if (this.protocol != null && this.protocol != '' && val == false)
        throw("ProtocolIsPresent");

    this._hasAuthorityPrefix = val;
    
});

juribuilder.prototype.__defineGetter__('userInfo', function () { return this.uri.userInfo; });
juribuilder.prototype.__defineSetter__('userInfo', function (val) { this.uri.userInfo = val; });

juribuilder.prototype.__defineGetter__('protocol', function () { return this.uri.protocol; });
juribuilder.prototype.__defineSetter__('protocol', function (val) { this.uri.protocol = val; });

juribuilder.prototype.__defineGetter__('host', function () { return this.uri.host; });
juribuilder.prototype.__defineSetter__('host', function (val) { this.uri.host = val; });

juribuilder.prototype.__defineGetter__('port', function () { return this.uri.port; });
juribuilder.prototype.__defineSetter__('port', function (val) { this.uri.port = val; });

juribuilder.prototype.__defineGetter__('path', function () { return this.uri.path; });
juribuilder.prototype.__defineSetter__('path', function (val) { this.uri.path = val; });

juribuilder.prototype.__defineGetter__('query', function () { return this.uri.query; });
juribuilder.prototype.__defineSetter__('query', function (val) { this.uri.query = val; });

juribuilder.prototype.__defineGetter__('anchor', function () { return this.uri.anchor; });
juribuilder.prototype.__defineSetter__('anchor', function (val) { this.uri.anchor = val; });


/*

// parseArgs() parses a query string and returns an object containing the parsed data
juribuilder.prototype.parseArgs = function (s) {
    var a = {};
    if (s && s.length) {
        var kp, kv;
        var p;
        if ((kp = s.split('&')) && kp.length) {
            for (var i = 0; i < kp.length; i++) {
                if ((kv = kp[i].split('=')) && kv.length == 2) {
                    if (p = kv[0].split(/(\[|\]\[|\])/)) {
                        for (var z = 0; z < p.length; z++) {
                            if (p[z] == ']' || p[z] == '[' || p[z] == '][') {
                                p.splice(z, 1);
                            }
                        }
                        var t = a;
                        for (var o = 0; o < p.length - 1; o++) {
                            if (typeof t[p[o]] == 'undefined') t[p[o]] = {}; // TODO: Change this to isset
                            t = t[p[o]];
                        }
                        t[p[p.length - 1]] = kv[1];
                    } else {
                        a[kv[0]] = kv[1];
                    }
                }
            }
        }
    }

    return a;
}

// removeArg() is used remove a specified argument from the juribuilder object arguments
juribuilder.prototype.removeArg = function (k) {
    if (k && String(k.constructor) == String(Array)) { // TODO: Change to use is_array
        var t = this.args;
        for (var i = 0; i < k.length - 1; i++) {
            if (typeof t[k[i]] != 'undefined') { // TODO: Change to use isset
                t = t[k[i]];
            } else {
                return false;
            }
        }
        delete t[k[k.length - 1]];
        return true;
    } else if (typeof this.args[k] != 'undefined') { // TODO: Change to use isset
        delete this.args[k];
        return true;
    }

    return false;
}

// addArg() is used to add an argument with specified value to the juribuilder object arguments
juribuilder.prototype.addArg = function (k, v, o) {
    if (k && String(k.constructor) == String(Array)) { // TODO: Change to use is_array
        var t = this.args;
        for (var i = 0; i < k.length - 1; i++) {
            if (typeof t[k[i]] == 'undefined') t[k[i]] = {};
            t = t[k[i]];
        }
        if (o || typeof t[k[k.length - 1]] == 'undefined') t[k[k.length - 1]] = v; // TODO: Change to use isset
    } else if (o || typeof this.args[k] == 'undefined') { // TODO: Change to use isset
        this.args[k] = v;
        return true;
    }

    return false;
}



// toArgs() takes an object and returns a query string
juribuilder.prototype.toArgs = function (a, p) {
    if (arguments.length < 2) p = '';
    if (a && typeof a == 'object') { // TODO: Change this to use is_object
        var s = '';
        for (i in a) {
            if (typeof a[i] != 'function') {
                if (s.length) s += '&';
                if (typeof a[i] == 'object') { // TODO: Change this to use is_object
                    var k = (p.length ? p + '[' + i + ']' : i);
                    s += this.toArgs(a[i], k);
                } else { // TODO: Change this to use is_function
                    s += p + (p.length && i != '' ? '[' : '') + i + (p.length && i != '' ? ']' : '') + '=' + a[i];
                }
            }
        }
        return s;
    }

    return '';
}

*/