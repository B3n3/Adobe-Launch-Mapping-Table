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
    var fromId = ev.dataTransfer.getData("number");
    var tr = document.getElementById(ev.target.id).parentNode;
    if (tr.nodeName === 'TR') {
        var toId = parseInt(tr.querySelector('input[type=submit]').id);

        var state = collectRows();
        // Backup data in destination
        state.tmp = {};
        for (var k in state[toId]) state['tmp'][k] = state[toId][k];

        // overwrite destination with fromId
        for (var k in state[toId]) state[toId][k] = state[fromId][k];

        // set fromId to values from backup
        for (var k in state['tmp']) state[fromId][k] = state['tmp'][k];

        delete state.tmp;
        console.log("new state: ", state);

        while (idCounter > 0) {
            console.log('deleting ' + (idCounter - 1));
            deleteRow(idCounter - 1);
        }

        initWithSettings({settings: state})
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
                console.log(tr);
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
            select.appendChild(opt1);
            select.appendChild(opt2);
            select.appendChild(opt3);
            select.appendChild(opt4);
            select.appendChild(opt5);


            var input = document.createElement('input');
            input.type = 'text';
            input.id = 'input' + idCounter;
            var output = document.createElement('input');
            output.type = 'text';
            output.id = 'output' + idCounter;
            output.style.width = '90%';
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
    console.warn('info', conf);
    if (typeof conf !== 'undefined' && conf !== null) {
        document.getElementById('dataElement').value = conf.dataElement;
        document.getElementById('defaultValueEmpty').checked = conf.defaultValueEmpty;
        for (var i = 0; i < conf.size; i++) {
            createRow();
            document.getElementById('select' + i).value = conf[i].method;
            document.getElementById('input' + i).value = conf[i].input;
            document.getElementById('output' + i).value = conf[i].output;
        }
    }
};

/**
 * Setup the required listeners for Launch
 */
window.extensionBridge.register({
    init: initWithSettings,

    getSettings: function () {
        return collectRows();
    },

    validate: function () {
        if (document.getElementById('dataElement').value === '') {
            return false;
        }

        for (var i = 0; i < idCounter; i++) {
            var inp = document.getElementById('input' + i).value;
            var out = document.getElementById('output' + i).value;
            if (inp === '' || out === '') {
                return false;
            }
        }
        return true;
    }
});