// 1) Imports
const path = require('path');
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

// 5) Database initialization
// Ensure we always use the DB file relative to this script, regardless of CWD
const dbPath = path.join(__dirname, 'database.db');
const db = new Database(dbPath);


// -- Drop and recreate tables for dev environment to ensure correct schema --
// (Remove these drops in production to preserve data!)
// right after you open your db:
db.exec('PRAGMA foreign_keys = OFF;');

// drop every table in your old schema:
db.exec('DROP TABLE IF EXISTS transactionline;');
db.exec('DROP TABLE IF EXISTS "transaction";');
db.exec('DROP TABLE IF EXISTS accountcategory;');
db.exec('DROP TABLE IF EXISTS "group";');
db.exec('DROP TABLE IF EXISTS masteraccount;');
db.exec('DROP TABLE IF EXISTS nonadminuser;');
db.exec('DROP TABLE IF EXISTS userpassword;');
db.exec('DROP TABLE IF EXISTS administrator;');

db.exec('PRAGMA foreign_keys = ON;');


// Creating tables
// Create userpassword table
db.exec(`
  CREATE TABLE userpassword (
    userpassword_id INTEGER PRIMARY KEY AUTOINCREMENT,
    encrypted_password TEXT NOT NULL,
    password_expiry_time INTEGER NOT NULL,
    user_account_expiry_date TEXT NOT NULL
  );
`);

// Create nonadminuser table
db.exec(`
  CREATE TABLE nonadminuser (
    nonadminuser_id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    username TEXT NOT NULL UNIQUE,
    address TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE,
    userpassword_id INTEGER NOT NULL,
    FOREIGN KEY(userpassword_id) REFERENCES userpassword(userpassword_id) ON DELETE CASCADE
  );
`);

// Create administrator table
db.exec(`
  CREATE TABLE administrator (
    administrator_id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT NOT NULL UNIQUE,
    encrypted_password TEXT NOT NULL
  );
`);

// Seed default admin if not present
const adminExists = db
    .prepare('SELECT 1 FROM administrator WHERE username = ?')
    .get('admin');
if (!adminExists) {
    const hash = bcrypt.hashSync('admin123', 10);
    db.prepare(
        'INSERT INTO administrator (username, encrypted_password) VALUES (?, ?)'
    ).run('admin', hash);
    console.log('✅ Default admin created: username=admin, password=admin123');
}

// Seed default non-admin users if none exist
const userCount = db.prepare('SELECT COUNT(*) as count FROM nonadminuser').get().count;
if (userCount === 0) {
    const defaultUsers = [
        { name: 'Alice Smith', username: 'alice', address: '123 Maple St', email: 'alice@example.com', password: 'alicepw' },
        { name: 'Bob Jones', username: 'bob', address: '456 Oak Ave', email: 'bob@example.com', password: 'bobpw' }
    ];
    defaultUsers.forEach(u => {
        const hash = bcrypt.hashSync(u.password, 10);
        const now = Math.floor(Date.now() / 1000);
        const expiryTime = now + 60 * 60 * 24 * 90;
        const accountExpiry = new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
        const pwInfo = db.prepare(
            `INSERT INTO userpassword (encrypted_password, password_expiry_time, user_account_expiry_date)
       VALUES (?, ?, ?)`
        ).run(hash, expiryTime, accountExpiry);
        db.prepare(
            `INSERT INTO nonadminuser (name, username, address, email, userpassword_id)
       VALUES (?, ?, ?, ?, ?)`
        ).run(u.name, u.username, u.address, u.email, pwInfo.lastInsertRowid);
    });
    console.log('✅ Seeded default non-admin users');
}

console.log('DB Successfully initialized');

// Admin: fetch all users
app.get('/admin/users', (req, res) => {
    try {
        const users = db.prepare(
            `SELECT nu.nonadminuser_id AS id,
              nu.name,
              nu.username,
              nu.address,
              nu.email,
              up.encrypted_password
       FROM nonadminuser nu
       JOIN userpassword up ON nu.userpassword_id = up.userpassword_id`
        ).all();
        return res.json({ users });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: 'Internal server error.' });
    }
});

// Update user
app.put('/users/:id', (req, res) => {
    try {
        const { id } = req.params;
        const { name, address, email } = req.body;
        if (!name || !address || !email) {
            return res.status(400).json({ message: 'Name, address, email required.' });
        }
        const info = db.prepare(
            `UPDATE nonadminuser SET name = ?, address = ?, email = ? WHERE nonadminuser_id = ?`
        ).run(name, address, email, id);
        if (info.changes === 0) return res.status(404).json({ message: 'User not found.' });
        return res.json({ message: 'User updated.' });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: 'Internal server error.' });
    }
});

// Delete user
app.delete('/users/:id', (req, res) => {
    try {
        const id = Number(req.params.id);
        // fetch userpassword_id
        const row = db.prepare('SELECT userpassword_id FROM nonadminuser WHERE nonadminuser_id = ?').get(id);
        if (!row) return res.status(404).json({ message: 'User not found.' });

        // delete user record first
        db.prepare('DELETE FROM nonadminuser WHERE nonadminuser_id = ?').run(id);
        // then delete its password record
        db.prepare('DELETE FROM userpassword WHERE userpassword_id = ?').run(row.userpassword_id);

        return res.json({ success: true });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: 'Internal server error.' });
    }
});

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

// 6) Login endpoint (handles both admin & non-admin)
app.post('/login', async (req, res) => {
    try {
        const { username, password } = req.body;
        if (!username || !password) {
            return res.status(400).json({ message: 'Username and password required.' });
        }

        // 6a) Check for admin credentials first
        const adminRow = db
            .prepare('SELECT administrator_id, encrypted_password FROM administrator WHERE username = ?')
            .get(username);
        if (adminRow) {
            const isAdmin = await bcrypt.compare(password, adminRow.encrypted_password);
            if (!isAdmin) {
                return res.status(401).json({ message: 'Invalid credentials.' });
            }
            // Return full list of non-admin users for admin
            const users = db
                .prepare(
                    `SELECT nonadminuser_id AS id, name, username, address, email
                     FROM nonadminuser`
                )
                .all();
            console.log('✅ Admin logged in, returning user list');
            return res.json({ admin: true, users });
        }

        // 6b) Non-admin login
        const row = db
            .prepare(
                `SELECT nu.nonadminuser_id AS id, nu.name, up.encrypted_password
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

        console.log('✅ Login successful for user', row.id);
        return res.json({
            userId: row.id,
            name: row.name,
            admin: false,
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