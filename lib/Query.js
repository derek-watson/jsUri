(function (global) {

    /**
     * unescape a query param value
     * @param  {string} s encoded value
     * @return {string}   decoded value
     */
    function decode(s) {
        s = decodeURIComponent(s);
        s = s.replace('+', ' ');
        return s;
    }

    /**
     * Query object constructor
     * @param {string} [str] initialize object with given query string
     */
    function Query(str) {
        var i, ps, p, kvp, k, v;

        this.params = [];

        if (typeof(str) === 'undefined' || str === null || str === '') {
            return;
        }

        if (str.indexOf('?') === 0) {
            str = str.substring(1);
        }

        ps = str.toString().split(/[&;]/);

        for (i = 0; i < ps.length; i++) {
            p = ps[i];
            kvp = p.split('=');
            k = kvp[0];
            v = p.indexOf('=') === -1 ? null : (kvp[1] === null ? '' : kvp[1]);
            this.params.push([k, v]);
        }
    }

    /**
     * returns the first query param value found for the key
     * @param  {string} key query key
     * @return {string}     first value found for key
     */
    Query.prototype.getParamValue = function (key) {
        var param, i;
        for (i = 0; i < this.params.length; i++) {
            param = this.params[i];
            if (decode(key) === decode(param[0])) {
                return param[1];
            }
        }
    };

    /**
     * returns an array of query param values for the key
     * @param  {string} key query key
     * @return {array}      array of values
     */
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

    /**
     * removes query parameters
     * @param  {string} key     remove values for key
     * @param  {val}    [val]   remove a specific value, otherwise removes all
     * @return {Query}          returns self for fluent chaining
     */
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

    /**
     * adds a query parameter
     * @param  {string}  key        add values for key
     * @param  {string}  val        value to add
     * @param  {integer} [index]    specific index to add the value at
     * @return {Query}              returns self for fluent chaining
     */
    Query.prototype.addParam = function (key, val, index) {
        if (arguments.length === 3 && index !== -1) {
            index = Math.min(index, this.params.length);
            this.params.splice(index, 0, [key, val]);
        } else if (arguments.length > 0) {
            this.params.push([key, val]);
        }
        return this;
    };

    /**
     * replaces query param values
     * @param  {string} key         key to replace value for
     * @param  {string} newVal      new value
     * @param  {string} [oldVal]    replace only one specific value (otherwise replaces all)
     * @return {Query}              returns self for fluent chaining
     */
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

    /**
     * Serializes the internal state of the Query object
     * @return {string}
     */
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

    /**
     * Clone a Query object
     * @return {Query} duplicate copy of the Query
     */
    Query.prototype.clone = function() {
        return new Query(this.toString());
    };

    /**
     * export via CommonJS, otherwise leak a global
     */
    if (typeof module === 'undefined') {
        global.Uri = global.Uri || {};
        global.Uri.Query = Query;
    }
    else {
        module.exports = Query;
    }
}(this));
