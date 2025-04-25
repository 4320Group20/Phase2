const Database = require('better-sqlite3');

// Open Database
const db = new Database('./database.db');

module.exports = db;