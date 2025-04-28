const Database = require('better-sqlite3');
const db = new Database('./database.db');

console.log('Initializing DB...');

// Creating tables
db.exec(`
  CREATE TABLE IF NOT EXISTS masteraccount (
    masteraccount_id INTEGER PRIMARY KEY AUTOINCREMENT,
    name VARCHAR(255) NOT NULL,
    opening_amount DOUBLE NOT NULL,
    closing_amount DOUBLE,
    group_id INTEGER,
    FOREIGN KEY (group_id) REFERENCES "group"(group_id)
  );
`);

db.exec(`
  CREATE TABLE IF NOT EXISTS "group" (
    group_id INTEGER PRIMARY KEY AUTOINCREMENT,
    name VARCHAR(255) NOT NULL,
    parent_masteraccount_id INTEGER,
    parent_group_id INTEGER,
    category_id INTEGER NOT NULL,
    FOREIGN KEY (parent_masteraccount_id) REFERENCES masteraccount(masteraccount_id)
      ON DELETE CASCADE,
    FOREIGN KEY (parent_group_id) REFERENCES "group"(group_id)
      ON DELETE CASCADE
  );
`);

db.exec(`
  CREATE TABLE IF NOT EXISTS userpassword (
    userpassword_id INTEGER PRIMARY KEY AUTOINCREMENT,
    encrypted_password VARCHAR(255) NOT NULL,
    password_expiry_time INT NOT NULL,
    user_account_expiry_date VARCHAR(255) NOT NULL 
  );
`);

db.exec(`
  CREATE TABLE IF NOT EXISTS nonadminuser (
    nonadminuser_id INTEGER PRIMARY KEY AUTOINCREMENT,
    name VARCHAR(255) NOT NULL,
    username VARCHAR(255) NOT NULL UNIQUE,
    address VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    userpassword_id INTEGER NOT NULL,
    FOREIGN KEY (userpassword_id) REFERENCES userpassword(userpassword_id) ON DELETE CASCADE
  );
`);

db.exec(`
  CREATE TABLE IF NOT EXISTS administrator (
    administrator_id INTEGER PRIMARY KEY AUTOINCREMENT,
    username VARCHAR(255) NOT NULL,
    encrypted_password VARCHAR(255) NOT NULL
  );
`);

db.exec(`
  CREATE TABLE IF NOT EXISTS accountcategory (
    accountcategory_id INTEGER PRIMARY KEY AUTOINCREMENT,
    name VARCHAR(255) NOT NULL,
    type VARCHAR(255),
    group_id INTEGER DEFAULT NULL,
    FOREIGN KEY (group_id) REFERENCES "group"(group_id)
      ON DELETE SET NULL
  );
`);

db.exec(`
  CREATE TABLE IF NOT EXISTS "transaction" (
    transaction_id INTEGER PRIMARY KEY AUTOINCREMENT,
    date VARCHAR(255) NOT NULL,
    description VARCHAR(255) NOT NULL,
    user_id INTEGER NOT NULL,
    FOREIGN KEY (user_id) REFERENCES nonadminuser(nonadminuser_id) ON DELETE CASCADE
  );
`);

db.exec(`
  CREATE TABLE IF NOT EXISTS transactionline (
    transactionline_id INTEGER PRIMARY KEY AUTOINCREMENT,
    credited_amount DOUBLE NOT NULL,
    debited_amount DOUBLE NOT NULL,
    comments VARCHAR(255) NOT NULL,
    transaction_id INTEGER NOT NULL,
    FOREIGN KEY (transaction_id) REFERENCES "transaction"(transaction_id) ON DELETE CASCADE
  );
`);

// Enable FK constraints
db.exec(`PRAGMA foreign_keys = ON;`);

console.log('DB Successfully initialized');
