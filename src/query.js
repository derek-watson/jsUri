
var Query = function (queryString) {

    // query string parsing, parameter manipulation and stringification

    'use strict';

    var // parseQuery(q) parses the uri query string and returns a multi-dimensional array of the components
        parseQuery = function (q) {
            var arr = [], i, ps, p, keyval;

            if (typeof (q) === 'undefined' || q === null || q === '') {
                return arr;
            }

            if (q.indexOf('?') === 0) {
                q = q.substring(1);
            }

            ps = q.toString().split(/[&;]/);

            for (i = 0; i < ps.length; i++) {
                p = ps[i];
                keyval = p.split('=');
                arr.push([keyval[0], keyval[1]]);
            }

            return arr;
        },

        params = parseQuery(queryString),

        // toString() returns a string representation of the internal state of the object
        toString = function () {
            var s = '', i, param;
            for (i = 0; i < params.length; i++) {
                param = params[i];
                if (s.length > 0) {
                    s += '&';
                }
                s += param.join('=');
            }
            return s.length > 0 ? '?' + s : s;
        },

        decode = function (s) {
            s = decodeURIComponent(s);
            s = s.replace('+', ' ');
            return s;
        },

        // getParamValues(key) returns the first query param value found for the key 'key'
        getParamValue = function (key) {
            var param, i;
            for (i = 0; i < params.length; i++) {
                param = params[i];
                if (decode(key) === decode(param[0])) {
                    return param[1];
                }
            }
        },

        // getParamValues(key) returns an array of query param values for the key 'key'
        getParamValues = function (key) {
            var arr = [], i, param;
            for (i = 0; i < params.length; i++) {
                param = params[i];
                if (decode(key) === decode(param[0])) {
                    arr.push(param[1]);
                }
            }
            return arr;
        },

        // deleteParam(key) removes all instances of parameters named (key)
        // deleteParam(key, val) removes all instances where the value matches (val)
        deleteParam = function (key, val) {

            var arr = [], i, param, keyMatchesFilter, valMatchesFilter;

            for (i = 0; i < params.length; i++) {

                param = params[i];
                keyMatchesFilter = decode(param[0]) === decode(key);
                valMatchesFilter = decode(param[1]) === decode(val);

                if ((arguments.length === 1 && !keyMatchesFilter) || (arguments.length === 2 && !keyMatchesFilter && !valMatchesFilter)) {
                    arr.push(param);
                }
            }

            params = arr;

            return this;
        },

        // addParam(key, val) Adds an element to the end of the list of query parameters
        // addParam(key, val, index) adds the param at the specified position (index)
        addParam = function (key, val, index) {

            if (arguments.length === 3 && index !== -1) {
                index = Math.min(index, params.length);
                params.splice(index, 0, [key, val]);
            } else if (arguments.length > 0) {
                params.push([key, val]);
            }
            return this;
        },

        // replaceParam(key, newVal) deletes all instances of params named (key) and replaces them with the new single value
        // replaceParam(key, newVal, oldVal) deletes only instances of params named (key) with the value (val) and replaces them with the new single value
        // this function attempts to preserve query param ordering
        replaceParam = function (key, newVal, oldVal) {

            var index = -1, i, param;

            if (arguments.length === 3) {
                for (i = 0; i < params.length; i++) {
                    param = params[i];
                    if (decode(param[0]) === decode(key) && decodeURIComponent(param[1]) === decode(oldVal)) {
                        index = i;
                        break;
                    }
                }
                deleteParam(key, oldVal).addParam(key, newVal, index);
            } else {
                for (i = 0; i < params.length; i++) {
                    param = params[i];
                    if (decode(param[0]) === decode(key)) {
                        index = i;
                        break;
                    }
                }
                deleteParam(key);
                addParam(key, newVal, index);
            }
            return this;
        };

    // public api
    return {
        getParamValue: getParamValue,
        getParamValues: getParamValues,
        deleteParam: deleteParam,
        addParam: addParam,
        replaceParam: replaceParam,
        
        toString: toString
    };
};
