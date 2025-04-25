const Database = require('better-sqlite3');
const db = new Database('./database.db');

console.log('Populating DB...');

db.transaction(() => {
  // Master Accounts
  const insertMaster = db.prepare('INSERT INTO masteraccount (name, opening_amount, closing_amount) VALUES (?, ?, ?)');
  insertMaster.run('Assets', 10000, 15000);
  insertMaster.run('Liabilities', 5000, 4500);
  insertMaster.run('Equity', 2000, 3000);

  // Groups
  const insertGroup = db.prepare('INSERT INTO "group" (name, parent_masteraccount_id, parent_group_id) VALUES (?, ?, ?)');
  insertGroup.run('Cash Group', 1, 1);
  insertGroup.run('Loan Group', 2, 2);
  insertGroup.run('Investment Group', 3, 3);

  // User Passwords
  const insertPwd = db.prepare('INSERT INTO userpassword (encrypted_password, password_expiry_time, user_account_expiry_date) VALUES (?, ?, ?)');
  insertPwd.run('encrypted123', 30, '2025-12-31');
  insertPwd.run('encrypted456', 60, '2026-06-30');
  insertPwd.run('encrypted789', 90, '2027-01-01');

  // Non-Admin Users
  const insertNonAdmin = db.prepare('INSERT INTO nonadminuser (name, address, email, userpassword_id) VALUES (?, ?, ?, ?)');
  insertNonAdmin.run('Alice', '123 Main St', 'alice@example.com', 1);
  insertNonAdmin.run('Bob', '456 Park Ave', 'bob@example.com', 2);
  insertNonAdmin.run('Charlie', '789 Elm St', 'charlie@example.com', 3);

  // Administrators
  const insertAdmin = db.prepare('INSERT INTO administrator (name, date_hired, date_finished, userpassword_id) VALUES (?, ?, ?, ?)');
  insertAdmin.run('Admin One', '2023-01-01', null, 1);
  insertAdmin.run('Admin Two', '2022-05-15', '2024-01-01', 2);
  insertAdmin.run('Admin Three', '2021-07-20', null, 3);

  // Account Categories
  const insertAccountCat = db.prepare('INSERT INTO accountcategory (name, type, group_id) VALUES (?, ?, ?)');
  insertAccountCat.run('Cash', 'Asset', 1);
  insertAccountCat.run('Loans', 'Liability', 2);
  insertAccountCat.run('Stocks', 'Equity', 3);

  // Transactions
  const insertTransaction = db.prepare('INSERT INTO "transaction" (date, description, user_id) VALUES (?, ?, ?)');
  insertTransaction.run('2024-01-01', 'Opening balance', 1);
  insertTransaction.run('2024-02-15', 'Loan payment', 2);
  insertTransaction.run('2024-03-20', 'Investment return', 3);

  // Transaction Lines
  const insertLine = db.prepare(`INSERT INTO transactionline (credited_amount, debited_amount, comments, transaction_id, first_masteraccount_id, second_masteraccount_id)
    VALUES (?, ?, ?, ?, ?, ?)`);
  insertLine.run(1000, 0, 'Deposit', 1, 1, 2);
  insertLine.run(0, 500, 'Loan Repayment', 2, 2, 3);
  insertLine.run(200, 0, 'Stock Gains', 3, 3, 1);
})();

console.log('DB Successfully populated');
