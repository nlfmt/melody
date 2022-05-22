const fs = require('fs');
const logger = require('./logger');

let data = {};

fs.readFile('db.json', (err, d) => {
    if (err) return;

    try {
        set(JSON.parse(d));
    }
    catch (e) {
        logger.error('DBLOAD', e);
    }
});


function save() {
    fs.writeFileSync('db.json', JSON.stringify(data));
}

// Returns the database.
function get() {
    return data;
}

// sets the database to the given data.
function set(d) {
    if (d instanceof Function) {
        data = d(data);
    }
    else {
        data = d;
    }
    save();
}

// Updates the database with the given data.
function update(d) {
    Object.assign(data, d);
    save();
}


module.exports = {
    get,
    set,
    update
}