(function (global) {

    function decode(s) {
        s = decodeURIComponent(s);
        s = s.replace('+', ' ');
        return s;
    }

    /**
     * Query object constructor
     * @param {string} q initialize object with given query string
     */
    function Query(q) {
        var i, ps, p, kvp, k, v;

        this.params = [];

        if (typeof(q) === 'undefined' || q === null || q === '') {
            return;
        }

        if (q.indexOf('?') === 0) {
            q = q.substring(1);
        }

        ps = q.toString().split(/[&;]/);

        for (i = 0; i < ps.length; i++) {
            p = ps[i];
            kvp = p.split('=');
            k = kvp[0];
            v = p.indexOf('=') === -1 ? null : (kvp[1] === null ? '' : kvp[1]);
            this.params.push([k, v]);
        }
    }

    // getParamValues(key) returns the first query param value found for the key 'key'
    Query.prototype.getParamValue = function (key) {
        var param, i;
        for (i = 0; i < this.params.length; i++) {
            param = this.params[i];
            if (decode(key) === decode(param[0])) {
                return param[1];
            }
        }
    };

    // getParamValues(key) returns an array of query param values for the key 'key'
    Query.prototype.getParamValues = function (key) {
        var arr = [],
            i, param;
        for (i = 0; i < this.params.length; i++) {
            param = this.params[i];
            if (decode(key) === decode(param[0])) {
                arr.push(param[1]);
            }
        }
        return arr;
    };

    // deleteParam(key) removes all instances of parameters named (key)
    // deleteParam(key, val) removes all instances where the value matches (val)
    Query.prototype.deleteParam = function (key, val) {

        var arr = [],
            i, param, keyMatchesFilter, valMatchesFilter;

        for (i = 0; i < this.params.length; i++) {

            param = this.params[i];
            keyMatchesFilter = decode(param[0]) === decode(key);
            valMatchesFilter = decode(param[1]) === decode(val);

            if ((arguments.length === 1 && !keyMatchesFilter) || (arguments.length === 2 && !keyMatchesFilter && !valMatchesFilter)) {
                arr.push(param);
            }
        }

        this.params = arr;

        return this;
    };

    // addParam(key, val) Adds an element to the end of the list of query parameters
    // addParam(key, val, index) adds the param at the specified position (index)
    Query.prototype.addParam = function (key, val, index) {

        if (arguments.length === 3 && index !== -1) {
            index = Math.min(index, this.params.length);
            this.params.splice(index, 0, [key, val]);
        } else if (arguments.length > 0) {
            this.params.push([key, val]);
        }
        return this;
    };

    // replaceParam(key, newVal) deletes all instances of params named (key) and replaces them with the new single value
    // replaceParam(key, newVal, oldVal) deletes only instances of params named (key) with the value (val) and replaces them with the new single value
    // this function attempts to preserve query param ordering
    Query.prototype.replaceParam = function (key, newVal, oldVal) {

        var index = -1,
            i, param;

        if (arguments.length === 3) {
            for (i = 0; i < this.params.length; i++) {
                param = this.params[i];
                if (decode(param[0]) === decode(key) && decodeURIComponent(param[1]) === decode(oldVal)) {
                    index = i;
                    break;
                }
            }
            this.deleteParam(key, oldVal).addParam(key, newVal, index);
        } else {
            for (i = 0; i < this.params.length; i++) {
                param = this.params[i];
                if (decode(param[0]) === decode(key)) {
                    index = i;
                    break;
                }
            }
            this.deleteParam(key);
            this.addParam(key, newVal, index);
        }
        return this;
    };

    Query.prototype.toString = function () {
        var s = '',
            i, param;
        for (i = 0; i < this.params.length; i++) {
            param = this.params[i];
            if (s.length > 0) {
                s += '&';
            }
            if (param[1] === null) {
                s += param[0];
            } else {
                s += param.join('=');
            }
        }
        return s.length > 0 ? '?' + s : s;
    };

    // export via CommonJS, otherwise leak a global
    if (typeof module === 'undefined') {
        global.Uri = global.Uri || {};
        global.Uri.Query = Query;
    }
    else {
        module.exports = Query;
    }
}(this));
