// Open Database
const Database = require('better-sqlite3');
const db = new Database('./database.db');

console.log('Initializing DB...');

// Initialize tables
db.exec(`
  CREATE TABLE IF NOT EXISTS nonadminuser (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name VARCHAR(255) NOT NULL,
    address VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE
  );
`);

db.exec(`
  CREATE TABLE IF NOT EXISTS administrator (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name VARCHAR(255) NOT NULL,
    datehired DATE NOT NULL,
    datefinished DATE
  );
`);

db.exec(`
  CREATE TABLE IF NOT EXISTS accountcategory (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name VARCHAR(255) NOT NULL,
    type VARCHAR(255) NOT NULL
  );
`);

db.exec(`
  CREATE TABLE IF NOT EXISTS "group" (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name VARCHAR(255) NOT NULL
  );
`);

db.exec(`
  CREATE TABLE IF NOT EXISTS masteraccount (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name VARCHAR(255) NOT NULL,
    openingamount DOUBLE NOT NULL,
    closingamount DOUBLE
  );
`);

db.exec(`
  CREATE TABLE IF NOT EXISTS "transaction" (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    date DATE NOT NULL,
    description VARCHAR(255) NOT NULL
  );
`);

db.exec(`
  CREATE TABLE IF NOT EXISTS transactionline (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    creditedamount DOUBLE NOT NULL,
    debitedamount DOUBLE NOT NULL,
    comments VARCHAR(255) NOT NULL
  );
`);

db.exec(`
  CREATE TABLE IF NOT EXISTS userpassword (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    encryptedpassword VARCHAR(255) NOT NULL,
    passwordexpirytime INT NOT NULL,
    useraccountexpirydate DATE NOT NULL
  );
`);

console.log('DB Successfully initialized');
