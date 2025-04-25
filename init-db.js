// Open Database
const Database = require('better-sqlite3');
const db = new Database('./database.db');

console.log('Initializing DB...');

// Initialize tables
db.exec(`
  CREATE TABLE IF NOT EXISTS nonadminuser (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    address TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE
  );
`);

console.log('DB Successfully initialized');
