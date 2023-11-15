'use strict';

/**
 * Returns the value matching the mapping table
 *
 * If no match is found, the value itself is returned
 *
 * @param settings The data element settings
 * @returns {*}
 */
module.exports = function (settings) {

    function checkValue(dataElemValue) {
        try {
            for (var i = 0; i < settings.size; i++) {
                var method = settings[i].method;
                var out = settings[i].output;
                var inp = settings[i].input;

                if (method === 'exact match') {
                    if (dataElemValue === inp) {
                        return out;
                    }
                } else if (method === 'exact match i') {
                    if (typeof dataElemValue === 'boolean') {
                        continue;
                    }
                    if (dataElemValue.toLowerCase() === inp.toLowerCase()) {
                        return out;
                    }
                } else if (method === 'starts with') {
                    if (typeof dataElemValue === 'boolean') {
                        continue;
                    }
                    if (dataElemValue.startsWith(inp)) {
                        return out;
                    }
                } else if (method === 'contains') {
                    if (typeof dataElemValue === 'boolean') {
                        continue;
                    }
                    if (dataElemValue.indexOf(inp) > -1) {
                        return out;
                    }
                } else if (method === 'regex') {
                    if (typeof dataElemValue === 'boolean') {
                        continue;
                    }
                    if (new RegExp(inp).test(dataElemValue)) {
                        return out;
                    }
                } else if (method === 'regex matching') {
                    if (typeof dataElemValue === 'boolean') {
                        continue;
                    }
                    var match = dataElemValue.match(new RegExp(inp));
                    if (match !== null) {
                        // We need to go top down to match $12 before matching $1
                        // match[0] is the whole match, thus we start / end with index 1
                        for (var j = (match.length - 1); j >= 1; j--) {
                            // Split-join is a way to replace all occurrences
                            out = out.split('$' + j).join(match[j]);
                        }
                        return out;
                    }
                } else if (method === 'is true') {
                    if (dataElemValue === true) {
                        return out;
                    }
                } else if (method === 'is false') {
                    if (dataElemValue === false) {
                        return out;
                    }
                }
            }
        } catch (e) {
            turbine.logger.error('Error during evaluation: ' + e.message);
        }

        if (settings.defaultValueEmpty === true) {
            return undefined;
        }
        return dataElemValue;
    }

    if (typeof settings !== 'undefined' && settings !== null) {
        var dataElemValue = settings.dataElement;
        addStartsWithToIE();
        if (typeof dataElemValue !== 'undefined' && dataElemValue !== null && Array.isArray(dataElemValue)) {
            return dataElemValue.map(checkValue);
        }
        return checkValue(dataElemValue);
    }
};

/**
 * Needed polyfill as IE doesn't support startsWith on strings
 */
var addStartsWithToIE = function () {
    if (!String.prototype.startsWith) {
        String.prototype.startsWith = function (searchString, position) {
            position = position || 0;
            return this.substr(position, searchString.length) === searchString;
        };
    }
};