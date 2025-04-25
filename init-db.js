// Open Database
const Database = require('better-sqlite3');
const db = new Database('./database.db');

console.log('Initializing DB...');

// Initialize tables
db.exec(`
  CREATE TABLE IF NOT EXISTS accountcategory (
    accountcategory_id INTEGER PRIMARY KEY AUTOINCREMENT,
    name VARCHAR(255) NOT NULL,
    type VARCHAR(255) NOT NULL
  );
`);

db.exec(`
  CREATE TABLE IF NOT EXISTS "group" (
    group_id INTEGER PRIMARY KEY AUTOINCREMENT,
    name VARCHAR(255) NOT NULL
  );
`);

db.exec(`
  CREATE TABLE IF NOT EXISTS masteraccount (
    masteraccount_id INTEGER PRIMARY KEY AUTOINCREMENT,
    name VARCHAR(255) NOT NULL,
    opening_amount DOUBLE NOT NULL,
    closing_amount DOUBLE
  );
`);

db.exec(`
  CREATE TABLE IF NOT EXISTS "transaction" (
    transaction_id INTEGER PRIMARY KEY AUTOINCREMENT,
    date DATE NOT NULL,
    description VARCHAR(255) NOT NULL
  );
`);

db.exec(`
  CREATE TABLE IF NOT EXISTS transactionline (
    transactionline_id INTEGER PRIMARY KEY AUTOINCREMENT,
    credited_amount DOUBLE NOT NULL,
    debited_amount DOUBLE NOT NULL,
    comments VARCHAR(255) NOT NULL
  );
`);

db.exec(`
  CREATE TABLE IF NOT EXISTS userpassword (
    userpassword_id INTEGER PRIMARY KEY AUTOINCREMENT,
    encrypted_password VARCHAR(255) NOT NULL,
    password_expiry_time INT NOT NULL,
    user_account_expiry_date DATE NOT NULL
  );
`);

db.exec(`
  CREATE TABLE IF NOT EXISTS nonadminuser (
    nonadminuser_id INTEGER PRIMARY KEY AUTOINCREMENT,
    name VARCHAR(255) NOT NULL,
    address VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    userpassword_id INTEGER NOT NULL,
    FOREIGN KEY (userpassword_id) REFERENCES userpassword(userpassword_id) 
  );
`);

db.exec(`
  CREATE TABLE IF NOT EXISTS administrator (
    administrator_id INTEGER PRIMARY KEY AUTOINCREMENT,
    name VARCHAR(255) NOT NULL,
    date_hired DATE NOT NULL,
    date_finished DATE
    userpassword_id INTEGER NOT NULL,
    FOREIGN KEY (userpassword_id) REFERENCES userpassword(userpassword_id)
  );
`);

console.log('DB Successfully initialized');
