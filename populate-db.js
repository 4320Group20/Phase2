const Database = require('better-sqlite3');
const bcrypt = require('bcrypt');
const db = new Database('./database.db');

console.log('Populating DB...');

// Insert default admin login if not present
const adminExists = db
    .prepare('SELECT 1 FROM administrator WHERE username = ?')
    .get('admin');
if (!adminExists) {
    const hash = bcrypt.hashSync('admin123', 10);
    db.prepare(
        'INSERT INTO administrator (username, encrypted_password) VALUES (?, ?)'
    ).run('admin', hash);
    console.log('Default admin created: username=admin, password=admin123');
}

// Insert default non-admin users if none exist
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
    console.log('Seeded default non-admin users');
}

// Inserting example transactions
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

    console.log('Seeded sample transactions for Alice & Bob');
})();

// Account Categories
(() => {
    const cats = [
        { name: 'Assets', type: 'Balance Sheet' },
        { name: 'Liabilities', type: 'Balance Sheet' },
        { name: 'Equity', type: 'Balance Sheet' },
        { name: 'Income', type: 'P&L' },
        { name: 'Expenses', type: 'P&L' },
    ];
    cats.forEach(cat => {
        const exists = db.prepare(
            'SELECT 1 FROM accountcategory WHERE name = ?'
        ).get(cat.name);
        if (!exists) {
            db.prepare(
                'INSERT INTO accountcategory(name,type) VALUES(?,?)'
            ).run(cat.name, cat.type);
        }
    });
    console.log('Seeded default account categories');
})();



console.log('DB Successfully populated');
