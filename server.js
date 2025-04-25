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

// Transaction tables
db.exec(`
  CREATE TABLE "transaction" (
    transaction_id INTEGER PRIMARY KEY AUTOINCREMENT,
    date TEXT NOT NULL,
    description TEXT NOT NULL,
    user_id INTEGER NOT NULL,
    FOREIGN KEY(user_id) REFERENCES nonadminuser(nonadminuser_id) ON DELETE CASCADE
  );
`);

db.exec(`
  CREATE TABLE transactionline (
    transactionline_id INTEGER PRIMARY KEY AUTOINCREMENT,
    transaction_id INTEGER NOT NULL,
    credited_amount REAL NOT NULL,
    debited_amount REAL NOT NULL,
    comments TEXT,
    FOREIGN KEY(transaction_id) REFERENCES "transaction"(transaction_id) ON DELETE CASCADE
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
        { name: 'Bob Jones', username: 'bob', address: '456 Oak Ave', email: 'bob@example.com', password: 'bobpw' },
        { name: 'Charlie Brown', username: 'charlie', address: '789 Pine Rd', email: 'charlie@example.com', password: 'charliepw' },
        { name: 'Dana White', username: 'dana', address: '101 Elm St', email: 'dana@example.com', password: 'danapw' },
        { name: 'Eve Black', username: 'eve', address: '202 Cedar Ln', email: 'eve@example.com', password: 'evepw' }
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

// ─── Dev-only: seed some transactions for Alice & Bob ───
(() => {
    // fetch their IDs
    const alice = db.prepare(`SELECT nonadminuser_id AS id FROM nonadminuser WHERE username = ?`).get('alice');
    const bob = db.prepare(`SELECT nonadminuser_id AS id FROM nonadminuser WHERE username = ?`).get('bob');
    if (!alice || !bob) return;

    // don't reseed if Alice already has transactions
    const existing = db.prepare(`SELECT 1 FROM "transaction" WHERE user_id = ?`).get(alice.id);
    if (existing) return;

    // helper to insert one transaction+lines
    const insertTxn = (userId, date, desc, lines) => {
        const t = db.prepare(`INSERT INTO "transaction"(date,description,user_id) VALUES(?,?,?)`)
            .run(date, desc, userId);
        const tid = t.lastInsertRowid;
        const insLine = db.prepare(`INSERT INTO transactionline
      (transaction_id, credited_amount, debited_amount, comments)
      VALUES(?,?,?,?)`);
        lines.forEach(l => insLine.run(tid, l.credit, l.debit, l.comments));
    };

    // Alice: one simple balanced transaction
    insertTxn(alice.id,
        new Date().toISOString(),
        'Alice initial deposit',
        [
            { credit: 1000, debit: 0, comments: 'Cash in' },
            { credit: 0, debit: 1000, comments: 'Equity out' }
        ]
    );

    // Bob: two sample transactions
    insertTxn(bob.id,
        new Date().toISOString(),
        'Bob salary',
        [
            { credit: 2000, debit: 0, comments: 'Salary' },
            { credit: 0, debit: 2000, comments: 'Income' }
        ]
    );
    insertTxn(bob.id,
        new Date().toISOString(),
        'Bob rent payment',
        [
            { credit: 0, debit: 800, comments: 'Cash out' },
            { credit: 800, debit: 0, comments: 'Rent exp' }
        ]
    );

    console.log('✅ Seeded sample transactions for Alice & Bob');
})();


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

// --- TRANSACTIONS --- //
app.post('/transactions', (req, res) => {
    try {
        const { date, description, userId, lines } = req.body;
        if (!date || !description || !userId || !Array.isArray(lines) || !lines.length)
            return res.status(400).json({ message: 'Invalid payload.' });
        // Validate balanced
        const sum = lines.reduce((a, l) => (a + (l.debitedAmount || 0) - (l.creditedAmount || 0)), 0);
        if (sum !== 0)
            return res.status(400).json({ message: 'Unbalanced transaction.' });
        // Insert transaction
        const t = db.prepare('INSERT INTO "transaction"(date,description,user_id)VALUES(?,?,?)')
            .run(date, description, userId);
        const tid = t.lastInsertRowid;
        const ls = db.prepare('INSERT INTO transactionline(transaction_id,credited_amount,debited_amount,comments)VALUES(?,?,?,?)');
        lines.forEach(l => ls.run(tid, l.creditedAmount || 0, l.debitedAmount || 0, l.comments || ''));
        console.log('✅ Transaction successful for user', userId);
        res.status(201).json({ transactionId: tid });
    } catch (e) { console.error(e); res.status(500).json({ message: 'Server error.' }); }
});

// GET transactions (optionally filtered by userId)
app.get('/transactions', (req, res) => {
    try {
        const userId = Number(req.query.userId);
        // Fetch all transaction+lines, then group by transaction
        const rows = db.prepare(`
      SELECT
        t.transaction_id AS id,
        t.date,
        t.description,
        tl.transactionline_id AS lineId,
        tl.credited_amount,
        tl.debited_amount,
        tl.comments
      FROM "transaction" t
      JOIN transactionline tl ON t.transaction_id = tl.transaction_id
      WHERE t.user_id = ?
    `).all(userId);

        const txMap = {};
        rows.forEach(r => {
            if (!txMap[r.id]) {
                txMap[r.id] = {
                    id: r.id,
                    date: r.date,
                    description: r.description,
                    lines: []
                };
            }
            txMap[r.id].lines.push({
                id: r.lineId,
                creditedAmount: r.credited_amount,
                debitedAmount: r.debited_amount,
                comments: r.comments
            });
        });

        return res.json({ transactions: Object.values(txMap) });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: 'Internal server error.' });
    }
});

// --- REPORT GENERATION --- //
app.post('/report', (req, res) => {
    try {
        const { reportType, startDate, endDate, accountType, category, userId } = req.body;
        if (!reportType || !startDate || !endDate) {
            return res.status(400).json({ message: 'reportType, startDate, and endDate are required.' });
        }
        // Pull all lines in the date range
        // now only grab that user’s transactions:
        const rows = db.prepare(`
            SELECT
              t.transaction_id  AS id,
              t.date,
              t.description,
              tl.credited_amount AS credit,
              tl.debited_amount  AS debit,
              tl.comments        AS category_field
            FROM "transaction" t
            JOIN transactionline tl ON t.transaction_id = tl.transaction_id
            WHERE t.user_id = ?
              AND date(t.date) BETWEEN date(?) AND date(?)
            `).all(userId, startDate, endDate);

        // Summary report
        if (reportType === 'summary') {
            const totalDebit = rows.reduce((sum, r) => sum + r.debit, 0);
            const totalCredit = rows.reduce((sum, r) => sum + r.credit, 0);
            return res.json({ reportType, startDate, endDate, totalDebit, totalCredit });
        }

        // Grouped report
        const data = {};
        rows.forEach(r => {
            let key;
            if (reportType === 'byAccount') {
                key = r.category_field === accountType ? accountType : 'Other';
            } else { // byCategory
                if (category && r.category_field !== category) return;
                key = r.category_field;
            }
            if (!data[key]) data[key] = { totalDebit: 0, totalCredit: 0 };
            data[key].totalDebit += r.debit;
            data[key].totalCredit += r.credit;
        });

        return res.json({ reportType, startDate, endDate, data });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: 'Server error.' });
    }
});



// 7) Start server
const PORT = 5000;
app.listen(PORT, () => console.log(`Server listening on port ${PORT}`));