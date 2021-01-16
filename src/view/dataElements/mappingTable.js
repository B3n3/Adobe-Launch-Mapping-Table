/**
 * Row counter used for delete, add and drag-drop events
 * @type {number}
 */
var idCounter = 0;


/**
 * Set onclick listener for data element chooser
 */
document.getElementById('dataElementBtn').onclick = function () {
    window.extensionBridge.openDataElementSelector().then(function (dataElement) {
        document.getElementById("dataElement").value = document.getElementById("dataElement").value + dataElement;
    });
};

/**
 * Set onclick listener for JSON edit button
 */
document.getElementById('editJson').onclick = function () {
    window.extensionBridge.openCodeEditor({
        code: JSON.stringify(collectRows(), undefined, 4),
        language: 'json'
    }).then(function (config) {
        try {
            var newConfig = JSON.parse(config);
            while (idCounter > 0) {
                deleteRow(idCounter - 1);
            }
            initWithSettings({settings: newConfig});
        } catch (e) {
            console.error(e.message);
        }
    });
}

/**
 * Set onclick listener for CSV edit button
 */
document.getElementById('editCsv').onclick = function () {
    var csv = '"method","input","output"';
    var settings = collectRows();
    for (var i = 0; i < idCounter; i++) {
        csv += '\n"' + settings[i].method + '","' + settings[i].input + '","' + settings[i].output + '"'
    }
    window.extensionBridge.openCodeEditor({
        code: csv,
        language: 'plaintext'
    }).then(function (config) {
        console.log(config);
        var rows = config.split('\n');

        while (idCounter > 0) {
            deleteRow(idCounter - 1);
        }

        var newConfig = collectRows();
        // skip first row (headers)
        for (var i = 1; i < rows.length; i++) {
            var row = new RegExp(/^"(.*)","(.*)","(.*)"$/).exec(rows[i])
            if (row !== null && row.length === 4) {
                newConfig[i - 1] = {
                    method: row[1],
                    input: row[2],
                    output: row[3]
                }
            } else {
                newConfig[i - 1] = {
                    method: 'exact match',
                    input: '',
                    output: ''
                }
                console.error('Error while parsing CSV. Invalid input.');
            }
        }
        newConfig.size = rows.length - 1; // exclude headers
        initWithSettings({settings: newConfig})
    });
}

/**
 * Delete a row, given an ID
 * @param rowId numeric ID
 */
var deleteRow = function (rowId) {
    rowId = parseInt(rowId);

    var table = document.getElementById("mappingTable");
    table.deleteRow(rowId + 1); // first row is heading
    for (var i = rowId + 1; i < idCounter; i++) {
        document.getElementById('select' + i).id = 'select' + (i - 1);
        document.getElementById('input' + i).id = 'input' + (i - 1);
        document.getElementById('output' + i).id = 'output' + (i - 1);
        document.getElementById(i).id = (i - 1);
    }

    idCounter--;
};

/**
 * Drag event handler, capturing the ID of the row which is dragged
 * @param ev
 */
function drag(ev) {
    var number = parseInt(ev.target.querySelector('input[type=submit]').id);
    ev.dataTransfer.setData("number", number);
}

/**
 * Drop event handler.
 *
 * This will collect the current state, reorder it based on the dropped row and then rebuild it.
 * @param ev
 */
function drop(ev) {
    ev.preventDefault();
    var fromId = parseInt(ev.dataTransfer.getData("number"));
    var tr = document.getElementById(ev.target.id).parentNode;
    if (tr.nodeName === 'TR') {
        var toId = parseInt(tr.querySelector('input[type=submit]').id);

        var state = collectRows();
        var newState = collectRows(); // other way of deep copy ;)

        // Moving a row from the bottom to the top
        if (toId < fromId) {
            // Everything before toId stays the same
            // Everything from incl. toId until fromId gets incremented +1
            for (var i = toId; i < fromId; i++) {
                newState[i + 1] = state[i];
            }
        } else if (fromId < toId) { // moving a row from the top down
            // Everything before toId stays the same
            // Everything from incl. toId until fromId gets incremented +1
            for (i = fromId + 1; i <= toId; i++) {
                newState[i - 1] = state[i];
            }
        }

        // overwrite fromId row to toId
        newState[toId] = state[fromId];

        console.log("[Mapping Table] New state after drag-and-drop:", newState);

        while (idCounter > 0) {
            deleteRow(idCounter - 1);
        }

        initWithSettings({settings: newState})
    }
}

/**
 * Adds an empty row to the mapping table
 */
function createRow() {
    return (function () {
            var row = document.createElement('tr');
            row.id = 'row' + idCounter;
            row.draggable = true;
            row.ondrop = function (ev) {
                drop(ev)
            };
            row.ondragover = function (ev) {
                ev.preventDefault();
                var tr = document.getElementById(ev.target.id).parentNode;
                if (tr.nodeName === 'TR') {
                    tr.style.backgroundColor = 'green';
                }
            };
            row.ondragleave = function (ev) {
                var tr = document.getElementById(ev.target.id).parentNode;
                if (tr.nodeName === 'TR') {
                    tr.style.backgroundColor = '#f2f2f2';
                }
            };
            row.ondragstart = function (ev) {
                drag(ev)
            };

            var col1 = document.createElement('td');
            col1.id = 'col1_' + idCounter;
            var col2 = document.createElement('td');
            col2.id = 'col2_' + idCounter;
            var col3 = document.createElement('td');
            col3.id = 'col3_' + idCounter;
            var col4 = document.createElement('td');
            col4.id = 'col4_' + idCounter;

            var select = document.createElement("select");
            select.id = 'select' + idCounter;
            var opt1 = document.createElement('option');
            opt1.value = 'exact match';
            opt1.text = 'exact match';
            opt1.selected = true;
            var opt2 = document.createElement('option');
            opt2.text = 'exact match (in-sensitive)';
            opt2.value = 'exact match i';
            var opt3 = document.createElement('option');
            opt3.text = 'contains';
            opt3.value = 'contains';
            var opt4 = document.createElement('option');
            opt4.text = 'starts with';
            opt4.value = 'starts with';
            var opt5 = document.createElement('option');
            opt5.text = 'regular expression';
            opt5.value = 'regex';
            var opt6 = document.createElement('option');
            opt6.text = 'regular expression (matching)';
            opt6.value = 'regex matching';
            var opt7 = document.createElement('option');
            opt7.text = 'is true';
            opt7.value = 'is true';
            var opt8 = document.createElement('option');
            opt8.text = 'is false';
            opt8.value = 'is false';
            select.appendChild(opt1);
            select.appendChild(opt2);
            select.appendChild(opt3);
            select.appendChild(opt4);
            select.appendChild(opt5);
            select.appendChild(opt6);
            select.appendChild(opt7);
            select.appendChild(opt8);

            // Disable Input fields when selecting 'is true' or 'is false' matching method
            select.onchange = (function (idCounter) {
                return function (elem) {
                    var disabled = false;
                    if (elem.target.value === 'is true' || elem.target.value === 'is false') {
                        disabled = true;
                    }
                    document.getElementById('input' + idCounter).disabled = disabled;
                }
            })(idCounter);

            var input = document.createElement('input');
            input.type = 'text';
            input.id = 'input' + idCounter;
            input.onfocus = function (ev) {
                row.draggable = false;
            };
            input.onblur = function (ev) {
                row.draggable = true;
            };
            var output = document.createElement('input');
            output.type = 'text';
            output.id = 'output' + idCounter;
            output.style.width = '90%';
            output.onfocus = function (ev) {
                row.draggable = false;
            };
            output.onblur = function (ev) {
                row.draggable = true;
            };

            var dataElementBtn = document.getElementById('dataElementBtn').cloneNode(true);
            dataElementBtn.style.visibility = 'visible';
            dataElementBtn.onclick = function (i) {
                return function () {
                    window.extensionBridge.openDataElementSelector().then(function (dataElement) {
                        document.getElementById('output' + i).value = document.getElementById('output' + i).value + dataElement;
                    });
                };
            }(idCounter);

            var deleteBtn = document.createElement('input');
            deleteBtn.type = 'submit';
            deleteBtn.value = 'x';
            deleteBtn.id = idCounter;
            deleteBtn.onclick = function () {
                deleteRow(this.id);
            };

            col1.appendChild(select);
            col2.appendChild(input);
            col3.appendChild(output);
            col3.appendChild(dataElementBtn);
            col4.appendChild(deleteBtn);
            row.appendChild(col1);
            row.appendChild(col2);
            row.appendChild(col3);
            row.appendChild(col4);
            var table = document.getElementById("mappingTable");
            table.appendChild(row);

            idCounter++;
        }
    )()
}

/**
 * Collects the current state into a JS object
 * @returns {{defaultValueEmpty: *, size: *, dataElement: *}}
 */
var collectRows = function () {
    var res = {
        'defaultValueEmpty': document.getElementById('defaultValueEmpty').checked,
        'size': idCounter,
        'dataElement': document.getElementById('dataElement').value
    };

    for (var i = 0; i < idCounter; i++) {
        var select = document.getElementById('select' + i);
        res[i] = {
            'method': select.options[select.selectedIndex].value,
            'input': document.getElementById('input' + i).value,
            'output': document.getElementById('output' + i).value
        }
    }
    return res;
};

/**
 * Builds up the table based on the saved state / settings
 * @param info contains the settings object
 */
var initWithSettings = function (info) {
    var conf = info.settings;
    console.warn('[Mapping Table] Settings:', conf);
    if (typeof conf !== 'undefined' && conf !== null) {
        document.getElementById('dataElement').value = conf.dataElement;
        document.getElementById('defaultValueEmpty').checked = conf.defaultValueEmpty;
        for (var i = 0; i < conf.size; i++) {
            createRow();
            var disable = false;
            var method = conf[i].method;
            if (method === 'is true' || method === 'is false') {
                disable = true;
            }
            document.getElementById('select' + i).value = method;
            var inputElem = document.getElementById('input' + i);
            inputElem.value = conf[i].input;
            inputElem.disabled = disable;
            document.getElementById('output' + i).value = conf[i].output;
        }
    }
};

/**
 * Check whether or not a string placed in the regex (matching) output contains a matching group within a data element
 *
 * E.g. "%abc $1% - %cde%" --> bad
 * but "%abc % $1 - %cde% --> fine
 * @param str the string to check
 * @returns true if it contains matching group inside a data element, false if not
 */
var checkDataElementStringContainsMatchingGroup = function (str) {
    var inside = false;
    var elem = '';
    for (var i = 0; i < str.length; i++) {
        var l = str[i];
        if (l === '%') {
            inside = !inside;
            if (inside === true) {
                elem = '';
            } else {
                if (/\$[0-9]+/.test(elem) === true) {
                    return true;
                }
            }
        }
        elem += l;
    }
    return false;
};

/**
 * Check if dataElement is set, all input and output fields are set and the regex matching group is used correctly.
 * @returns {boolean}
 */
var validationFn = function () {
    if (document.getElementById('dataElement').value === '') {
        return false;
    }

    for (var i = 0; i < idCounter; i++) {
        var inp = document.getElementById('input' + i).value;
        var out = document.getElementById('output' + i).value;
        var method = document.getElementById('select' + i).value;
        if (method === 'is true' || method === 'is false') {
            if (out === '' || inp !== '') {
                return false;
            }
        } else {
            if (inp === '' || out === '') {
                return false;
            }
        }

        // Check "regex matching" output values
        if (document.getElementById('select' + i).value === 'regex matching') {
            if (checkDataElementStringContainsMatchingGroup(out)) {
                var errorMsg = 'Output in row ' + (i + 1) + ' contains a matching group inside a data element!';
                console.error(errorMsg);
                alert(errorMsg);
                return false;
            }
        }
    }
    return true;
};

/**
 * Setup the required listeners for Launch
 */
window.extensionBridge.register({
    init: initWithSettings,
    getSettings: collectRows,
    validate: validationFn
});