// 1) Imports
const express = require('express');
const cors = require('cors');
const bcrypt = require('bcrypt');
const Database = require('better-sqlite3');

// 2) Instantiate Express *before* you ever use `app`
const app = express();

// 3) Middleware
app.use(cors());            // CORS must come before your routes
app.use(express.json());    // JSON‐body parsing

// 4) (Optional) Request‐logging  now `app` is defined!
app.use((req, res, next) => {
    console.log(new Date().toISOString(), req.method, req.url);
    next();
});

// 5) Database setup
const db = new Database('./database.db');
console.log('Initializing DB...');

// Creating tables
db.exec(`
  CREATE TABLE IF NOT EXISTS masteraccount (
    masteraccount_id INTEGER PRIMARY KEY AUTOINCREMENT,
    name VARCHAR(255) NOT NULL,
    opening_amount DOUBLE NOT NULL,
    closing_amount DOUBLE
  );
`);

db.exec(`
  CREATE TABLE IF NOT EXISTS "group" (
    group_id INTEGER PRIMARY KEY AUTOINCREMENT,
    name VARCHAR(255) NOT NULL,
    parent_masteraccount_id INTEGER NOT NULL,
    parent_group_id INTEGER NOT NULL,
    FOREIGN KEY (parent_masteraccount_id) REFERENCES masteraccount(masteraccount_id),
    FOREIGN KEY (parent_group_id) REFERENCES "group"(group_id)
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
    
  PRAGMA foreign_keys = OFF;
  DROP TABLE IF EXISTS nonadminuser;
  PRAGMA foreign_keys = ON;

  CREATE TABLE IF NOT EXISTS nonadminuser (
    nonadminuser_id INTEGER PRIMARY KEY AUTOINCREMENT,
    name VARCHAR(255) NOT NULL,
    username VARCHAR(255) NOT NULL UNIQUE,
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
    date_finished DATE,
    userpassword_id INTEGER NOT NULL,
    FOREIGN KEY (userpassword_id) REFERENCES userpassword(userpassword_id)
  );
`);

db.exec(`
  CREATE TABLE IF NOT EXISTS accountcategory (
    accountcategory_id INTEGER PRIMARY KEY AUTOINCREMENT,
    name VARCHAR(255) NOT NULL,
    type VARCHAR(255) NOT NULL,
    group_id INTEGER NOT NULL,
    FOREIGN KEY (group_id) REFERENCES "group"(group_id)
  );
`);

db.exec(`
  CREATE TABLE IF NOT EXISTS "transaction" (
    transaction_id INTEGER PRIMARY KEY AUTOINCREMENT,
    date DATE NOT NULL,
    description VARCHAR(255) NOT NULL,
    user_id INTEGER NOT NULL,
    FOREIGN KEY (user_id) REFERENCES nonadminuser(nonadminuser_id)
  );
`);

db.exec(`
  CREATE TABLE IF NOT EXISTS transactionline (
    transactionline_id INTEGER PRIMARY KEY AUTOINCREMENT,
    credited_amount DOUBLE NOT NULL,
    debited_amount DOUBLE NOT NULL,
    comments VARCHAR(255) NOT NULL,
    transaction_id INTEGER NOT NULL,
    first_masteraccount_id INTEGER NOT NULL,
    second_masteraccount_id INTEGER NOT NULL,
    FOREIGN KEY (transaction_id) REFERENCES "transaction"(transaction_id),
    FOREIGN KEY (first_masteraccount_id) REFERENCES masteraccount(masteraccount_id),
    FOREIGN KEY (second_masteraccount_id) REFERENCES masteraccount(masteraccount_id)
  );
`);

console.log('DB Successfully initialized');

// 5) Registration endpoint
app.post('/register', async (req, res) => {
    try {
        const { name, username, address, email, password } = req.body;
        if (!name || !username || !address || !email || !password) {
            return res.status(400).json({ message: 'All fields are required.' });
        }

        // Check username uniqueness
        const exists = db.prepare(
            'SELECT 1 FROM nonadminuser WHERE username = ?'
        ).get(username);
        if (exists) {
            return res.status(409).json({ message: 'Username already taken.' });
        }

        // Hash the password
        const hash = await bcrypt.hash(password, 10);
        const now = Math.floor(Date.now() / 1000);
        const expiryTime = now + 60 * 60 * 24 * 90; // 90 days in seconds
        const accountExpiryDate = new Date(
            Date.now() + 365 * 24 * 60 * 60 * 1000
        )
            .toISOString()
            .split('T')[0];

        // Insert into userpassword
        const upInfo = db.prepare(
            `INSERT INTO userpassword (encrypted_password, password_expiry_time, user_account_expiry_date)
       VALUES (?, ?, ?)`
        ).run(hash, expiryTime, accountExpiryDate);
        const userpassword_id = upInfo.lastInsertRowid;

        // Insert into nonadminuser
        const userInfo = db.prepare(
            `INSERT INTO nonadminuser (name, username, address, email, userpassword_id)
       VALUES (?, ?, ?, ?, ?)`
        ).run(name, username, address, email, userpassword_id);

        console.log('✅ User registered with id', userInfo.lastInsertRowid);
        return res
            .status(201)
            .json({ userId: userInfo.lastInsertRowid, message: 'Registered successfully.' });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: 'Internal server error.' });
    }
});

// 6) Login endpoint
app.post('/login', async (req, res) => {
    try {
        const { username, password } = req.body;
        if (!username || !password) {
            return res
                .status(400)
                .json({ message: 'Username and password required.' });
        }

        const row = db
            .prepare(
                `SELECT nu.nonadminuser_id, nu.name, up.encrypted_password
         FROM nonadminuser nu
         JOIN userpassword up ON nu.userpassword_id = up.userpassword_id
         WHERE nu.username = ?`
            )
            .get(username);

        if (!row) {
            return res.status(401).json({ message: 'Invalid credentials.' });
        }

        const match = await bcrypt.compare(password, row.encrypted_password);
        if (!match) {
            return res.status(401).json({ message: 'Invalid credentials.' });
        }

        console.log('✅ Login successful for user', row.nonadminuser_id);
        return res.json({
            userId: row.nonadminuser_id,
            name: row.name,
            message: 'Login successful.'
        });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: 'Internal server error.' });
    }
});

// 7) Start server
const PORT = 5000;
app.listen(PORT, () => console.log(`Server listening on port ${PORT}`));