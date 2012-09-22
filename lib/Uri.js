(function(global) {
    var Query = (typeof(require) === 'function') ? require('./Query') : global.Uri.Query,
        parser = /^(?:(?![^:@]+:[^:@\/]*@)([^:\/?#.]+):)?(?:\/\/)?((?:(([^:@]*)(?::([^:@]*))?)?@)?([^:\/?#]*)(?::(\d*))?)(((\/(?:[^?#](?![^?#\/]*\.[^?#\/.]+(?:[?#]|$)))*\/?)?([^?#\/]*))(?:\?([^#]*))?(?:#(.*))?)/,
        parserKeys = ["source", "protocol", "authority", "userInfo", "user", "password", "host", "port", "relative", "path", "directory", "file", "query", "anchor"];

    /**
     * Define forEach for older js environments
     * @see https://developer.mozilla.org/en-US/docs/JavaScript/Reference/Global_Objects/Array/forEach#Compatibility
     */
    if (!Array.prototype.forEach) {
        Array.prototype.forEach = function(fn, scope) {
            for (var i = 0, len = this.length; i < len; ++i) {
                fn.call(scope || this, this[i], i, this);
            }
        };
    }

    /**
     * Creates a new Uri object
     * @constructor
     * @param {string} str
     */
    function Uri(str) {
        str = str || '';

        var q = {
                name: 'queryKey',
                parser: /(?:^|&)([^&=]*)=?([^&]*)/g
            },
            m = parser.exec(str),
            i = 14,
            self = this;

        this.uriParts = {};

        parserKeys.forEach(function(key, j) {
            self.uriParts[key] = m[j] || '';
        });

        this.queryObj = new Query(this.uriParts.query);
        this.hasAuthorityPrefixUserPref = null;
    }

    /**
     * Define getter/setter methods
     */
    ['protocol', 'userInfo', 'host', 'port', 'path', 'anchor'].forEach(function(key) {
        Uri.prototype[key] = function(val) {
            if (typeof val !== 'undefined') {
                this.uriParts[key] = val;
            }
            return this.uriParts[key];
        };
    });

    /**
     * if there is no protocol, the leading // can be enabled or disabled
     * @param  {Boolean}  val
     * @return {Boolean}
     */
    Uri.prototype.hasAuthorityPrefix = function(val) {
        if (typeof val !== 'undefined') {
            this.hasAuthorityPrefixUserPref = val;
        }

        if (this.hasAuthorityPrefixUserPref === null) {
            return (this.uriParts.source.indexOf('//') !== -1);
        } else {
            return this.hasAuthorityPrefixUserPref;
        }
    };

    /**
     * Wraps a Query object
     * @param  {string} val query string
     * @return {Query}      Query object
     */
    Uri.prototype.query = function(val) {
        if (typeof val !== 'undefined') {
            this.queryObj = new Query(val);
        }
        return this.queryObj;
    };

    /**
     * Define fluent setter methods (setProtocol, setHasAuthorityPrefix, etc)
     */
    ['protocol', 'hasAuthorityPrefix', 'userInfo', 'host', 'port', 'path', 'query', 'anchor'].forEach(function(key) {
        var method = 'set' + key.charAt(0).toUpperCase() + key.slice(1);
        Uri.prototype[method] = function(val) {
            this[key](val);
            return this;
        };
    });

    /**
     * Query method wrappers (soon to be deprecated)
     */
    [
        ['get', 'ParamValue'],
        ['get', 'ParamValues'],
        ['delete', 'Param'],
        ['add', 'Param'],
        ['replace', 'Param']
    ].forEach(function(parts) {
        var originalMethod = parts.join(''),
            proxyMethod = parts[0] + 'Query' + parts[1];
        Uri.prototype[proxyMethod] = function() {
            var args = Array.prototype.slice.apply(arguments),
                retVal = this.queryObj[originalMethod].apply(this.queryObj, args);
            return parts[0] === 'get' ? retVal : this;
        };
    });

    /**
     * Scheme name, colon and doubleslash, as required
     * @return {string} http:// or possibly just //
     */
    Uri.prototype.scheme = function() {

        var s = '';

        if (this.protocol()) {
            s += this.protocol();
            if (this.protocol().indexOf(':') !== this.protocol().length - 1) {
                s += ':';
            }
            s += '//';
        } else {
            if (this.hasAuthorityPrefix() && this.host()) {
                s += '//';
            }
        }

        return s;
    };

    /**
     * Same as Mozilla nsIURI.prePath
     * @return {string} scheme://user:password@host:port
     * @see  https://developer.mozilla.org/en/nsIURI
     */
    Uri.prototype.origin = function() {

        var s = this.scheme();

        if (this.userInfo() && this.host()) {
            s += this.userInfo();
            if (this.userInfo().indexOf('@') !== this.userInfo().length - 1) {
                s += '@';
            }
        }

        if (this.host()) {
            s += this.host();
            if (this.port()) {
                s += ':' + this.port();
            }
        }

        return s;
    };

    /**
     * Serializes the internal state of the Uri object
     * @return {string}
     */
    Uri.prototype.toString = function() {

        var s = this.origin();

        if (this.path()) {
            s += this.path();
        } else {
            if (this.host() && (this.query().toString() || this.anchor())) {
                s += '/';
            }
        }
        if (this.query().toString()) {
            if (this.query().toString().indexOf('?') !== 0) {
                s += '?';
            }
            s += this.query().toString();
        }

        if (this.anchor()) {
            if (this.anchor().indexOf('#') !== 0) {
                s += '#';
            }
            s += this.anchor();
        }

        return s;
    };

    /**
     * Clone a Uri object
     * @return {Uri} duplicate copy of the Uri
     */
    Uri.prototype.clone = function() {
        return new Uri(this.toString());
    };

    /**
     * export via CommonJS, otherwise leak a global
     */
    if (typeof module === 'undefined') {
        global.Uri = Uri;
        global.Uri.Query = Query;
    } else {
        module.exports = Uri;
    }
}(this));
