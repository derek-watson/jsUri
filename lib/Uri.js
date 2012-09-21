(function (global) {
    var Query = (typeof(require) === 'function') ? require('./Query') : global.Query;

    function Uri(uriStr) {

        uriStr = uriStr || '';

        var parser = /^(?:(?![^:@]+:[^:@\/]*@)([^:\/?#.]+):)?(?:\/\/)?((?:(([^:@]*)(?::([^:@]*))?)?@)?([^:\/?#]*)(?::(\d*))?)(((\/(?:[^?#](?![^?#\/]*\.[^?#\/.]+(?:[?#]|$)))*\/?)?([^?#\/]*))(?:\?([^#]*))?(?:#(.*))?)/,
            keys = ["source", "protocol", "authority", "userInfo", "user", "password", "host", "port", "relative", "path", "directory", "file", "query", "anchor"],
            q = {
                name: 'queryKey',
                parser: /(?:^|&)([^&=]*)=?([^&]*)/g
            },
            m = parser.exec(uriStr),
            i = 14,
            self = this;

        this.uriParts = {};

        while (i--) {
            this.uriParts[keys[i]] = m[i] || "";
        }

        this.uriParts[q.name] = {};
        this.uriParts[keys[12]].replace(q.parser, function ($0, $1, $2) {
            if ($1) {
                self.uriParts[q.name][$1] = $2;
            }
        });

        this.queryObj = new Query(this.uriParts.query);

        this.hasAuthorityPrefixUserPref = null;
    }


    /*
    Basic get/set functions for all properties
    */
    Uri.prototype.protocol = function (val) {
        if (typeof val !== 'undefined') {
            this.uriParts.protocol = val;
        }
        return this.uriParts.protocol;
    };

    // hasAuthorityPrefix: if there is no protocol, the leading // can be enabled or disabled
    Uri.prototype.hasAuthorityPrefix = function (val) {

        if (typeof val !== 'undefined') {
            this.hasAuthorityPrefixUserPref = val;
        }

        if (this.hasAuthorityPrefixUserPref === null) {
            return (this.uriParts.source.indexOf('//') !== -1);
        } else {
            return this.hasAuthorityPrefixUserPref;
        }
    };

    Uri.prototype.userInfo = function (val) {
        if (typeof val !== 'undefined') {
            this.uriParts.userInfo = val;
        }
        return this.uriParts.userInfo;
    };

    Uri.prototype.host = function (val) {
        if (typeof val !== 'undefined') {
            this.uriParts.host = val;
        }
        return this.uriParts.host;
    };

    Uri.prototype.port = function (val) {
        if (typeof val !== 'undefined') {
            this.uriParts.port = val;
        }
        return this.uriParts.port;
    };

    Uri.prototype.path = function (val) {
        if (typeof val !== 'undefined') {
            this.uriParts.path = val;
        }
        return this.uriParts.path;
    };

    Uri.prototype.query = function (val) {
        if (typeof val !== 'undefined') {
            this.queryObj = new Query(val);
        }
        return this.queryObj;
    };

    Uri.prototype.anchor = function (val) {
        if (typeof val !== 'undefined') {
            this.uriParts.anchor = val;
        }
        return this.uriParts.anchor;
    };

    /*
      Fluent setters for Uri properties
    */
    Uri.prototype.setProtocol = function (val) {
        this.protocol(val);
        return this;
    };

    Uri.prototype.setHasAuthorityPrefix = function (val) {
        this.hasAuthorityPrefix(val);
        return this;
    };

    Uri.prototype.setUserInfo = function (val) {
        this.userInfo(val);
        return this;
    };

    Uri.prototype.setHost = function (val) {
        this.host(val);
        return this;
    };

    Uri.prototype.setPort = function (val) {
        this.port(val);
        return this;
    };

    Uri.prototype.setPath = function (val) {
        this.path(val);
        return this;
    };

    Uri.prototype.setQuery = function (val) {
        this.query(val);
        return this;
    };

    Uri.prototype.setAnchor = function (val) {
        this.anchor(val);
        return this;
    };


    /*
      Query method wrappers
    */
    Uri.prototype.getQueryParamValue = function (key) {
        return this.query().getParamValue(key);
    };

    Uri.prototype.getQueryParamValues = function (key) {
        return this.query().getParamValues(key);
    };

    Uri.prototype.deleteQueryParam = function (key, val) {
        if (arguments.length === 2) {
            this.query().deleteParam(key, val);
        } else {
            this.query().deleteParam(key);
        }

        return this;
    };

    Uri.prototype.addQueryParam = function (key, val, index) {
        if (arguments.length === 3) {
            this.query().addParam(key, val, index);
        } else {
            this.query().addParam(key, val);
        }
        return this;
    };

    Uri.prototype.replaceQueryParam = function (key, newVal, oldVal) {
        if (arguments.length === 3) {
            this.query().replaceParam(key, newVal, oldVal);
        } else {
            this.query().replaceParam(key, newVal);
        }

        return this;
    };


    /*
    Serialization
    */
    Uri.prototype.scheme = function () {

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

    /*
    Same as Mozilla nsIURI.prePath
    cf. https://developer.mozilla.org/en/nsIURI
    */
    Uri.prototype.origin = function () {

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


    // toString() stringifies the current state of the uri
    Uri.prototype.toString = function () {

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

    /*
        Cloning
    */
    Uri.prototype.clone = function () {
        return new Uri(this.toString());
    };

    // export via CommonJS, otherwise leak a global
    if (typeof module === 'undefined') {
        global.Uri = Uri;
        delete global.Query;
    }
    else {
        module.exports = Uri;
    }
}(this));

