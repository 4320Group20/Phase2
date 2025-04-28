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

// GET all categories
app.get('/account-categories', (req, res) => {
    try {
        const cats = db.prepare(`
      SELECT
        accountcategory_id AS accountcategory_id,
        name,
        type
      FROM accountcategory
    `).all();
        res.json({ categories: cats });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Could not fetch categories.' });
    }
});

// POST a new category
app.post('/account-categories', (req, res) => {
    const { name, type } = req.body;
    if (!name) return res.status(400).json({ message: 'Name is required.' });
    try {
        const info = db.prepare(`
      INSERT INTO accountcategory (name, type)
      VALUES (?, ?)
    `).run(name, type || null);
        const cat = db.prepare(`
      SELECT accountcategory_id AS accountcategory_id, name, type
      FROM accountcategory
      WHERE accountcategory_id = ?
    `).get(info.lastInsertRowid);
        res.status(201).json({ category: cat });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Could not create category.' });
    }
});

// PUT (rename/update) a category
app.put('/account-categories/:id', (req, res) => {
    const id = Number(req.params.id);
    const { name, type } = req.body;
    if (!name && type === undefined) {
        return res.status(400).json({ message: 'Nothing to update.' });
    }
    const sets = [];
    const vals = [];
    if (name) { sets.push('name = ?'); vals.push(name); }
    if (type !== undefined) { sets.push('type = ?'); vals.push(type); }
    vals.push(id);

    try {
        const info = db.prepare(`
      UPDATE accountcategory
      SET ${sets.join(', ')}
      WHERE accountcategory_id = ?
    `).run(...vals);
        if (info.changes === 0) {
            return res.status(404).json({ message: 'Category not found.' });
        }
        res.json({ message: 'Category updated.' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Could not update category.' });
    }
});

// DELETE a category
app.delete('/account-categories/:id', (req, res) => {
    const id = Number(req.params.id);
    try {
        const info = db.prepare(`
      DELETE FROM accountcategory
      WHERE accountcategory_id = ?
    `).run(id);
        if (info.changes === 0) {
            return res.status(404).json({ message: 'Category not found.' });
        }
        res.json({ message: 'Category deleted.' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Could not delete category.' });
    }
});


// ─── GROUP ROUTES ───

// GET all groups (with category name for the front-end)
app.get('/groups', (req, res) => {
    try {
        const gs = db.prepare(`
      SELECT
        g.group_id,
        g.name,
        g.category_id,
        c.name AS category_name,
        g.parent_group_id
      FROM "group" g
      JOIN accountcategory c
        ON g.category_id = c.accountcategory_id
    `).all();
        res.json({ groups: gs });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Could not fetch groups.' });
    }
});

// POST a new group
app.post('/groups', (req, res) => {
    const { name, category_id, parent_group_id } = req.body;
    if (!name || !category_id) {
        return res.status(400).json({ message: 'Name and category_id are required.' });
    }
    try {
        const info = db.prepare(`
      INSERT INTO "group" (name, category_id, parent_group_id)
      VALUES (?, ?, ?)
    `).run(name, category_id, parent_group_id || null);
        const g = db.prepare(`
      SELECT
        group_id, name, category_id, parent_group_id
      FROM "group"
      WHERE group_id = ?
    `).get(info.lastInsertRowid);
        res.status(201).json({ group: g });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Could not create group.' });
    }
});

// PUT (rename/update) a group
app.put('/groups/:id', (req, res) => {
    const id = Number(req.params.id);
    const { name, category_id, parent_group_id } = req.body;
    const sets = [];
    const vals = [];
    if (name) { sets.push('name = ?'); vals.push(name); }
    if (category_id) { sets.push('category_id = ?'); vals.push(category_id); }
    if (parent_group_id !== undefined) {
        sets.push('parent_group_id = ?');
        vals.push(parent_group_id || null);
    }
    if (!sets.length) {
        return res.status(400).json({ message: 'Nothing to update.' });
    }
    vals.push(id);

    try {
        const info = db.prepare(`
      UPDATE "group"
      SET ${sets.join(', ')}
      WHERE group_id = ?
    `).run(...vals);
        if (info.changes === 0) {
            return res.status(404).json({ message: 'Group not found.' });
        }
        res.json({ message: 'Group updated.' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Could not update group.' });
    }
});

// DELETE a group
app.delete('/groups/:id', (req, res) => {
    const id = Number(req.params.id);
    try {
        const info = db.prepare(`
      DELETE FROM "group"
      WHERE group_id = ?
    `).run(id);
        if (info.changes === 0) {
            return res.status(404).json({ message: 'Group not found.' });
        }
        res.json({ message: 'Group deleted.' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Could not delete group.' });
    }
});


// Enable FK constraints
db.exec(`PRAGMA foreign_keys = ON;`);

// ─── 1) Ensure masteraccount has a group_id column ───
try {
    db.prepare(`ALTER TABLE masteraccount ADD COLUMN group_id INTEGER`).run();
} catch (e) {
    // ignore if it already exists
}

// ─── 2) GET all master accounts ───
app.get('/masteraccounts', (req, res) => {
    try {
        const rows = db.prepare(`
      SELECT
        m.masteraccount_id   AS masteraccount_id,
        m.name               AS name,
        m.opening_amount     AS opening_amount,
        m.closing_amount     AS closing_amount,
        m.group_id           AS parent_group_id
      FROM masteraccount m
    `).all();

        return res.json({ accounts: rows });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: 'Could not fetch accounts.' });
    }
});

// ─── 3) CREATE a new master account ───
app.post('/masteraccounts', (req, res) => {
    const { name, opening_amount, parent_group_id } = req.body;
    if (!name || opening_amount == null) {
        return res.status(400).json({ message: 'name and opening_amount are required.' });
    }
    try {
        const info = db.prepare(`
      INSERT INTO masteraccount
        (name, opening_amount, closing_amount, group_id)
      VALUES (?, ?, ?, ?)
    `).run(
            name,
            opening_amount,
            opening_amount,            // initialize closing = opening
            parent_group_id || null
        );
        const account = db.prepare(`
      SELECT masteraccount_id, name, opening_amount, closing_amount, group_id AS parent_group_id
      FROM masteraccount
      WHERE masteraccount_id = ?
    `).get(info.lastInsertRowid);

        return res.status(201).json({ account });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: 'Could not create account.' });
    }
});

// ─── 4) UPDATE an existing master account ───
app.put('/masteraccounts/:id', (req, res) => {
    const id = Number(req.params.id);
    const { name, opening_amount, parent_group_id } = req.body;
    const sets = [];
    const vals = [];
    if (name !== undefined) { sets.push('name = ?'); vals.push(name); }
    if (opening_amount !== undefined) { sets.push('opening_amount = ?'); vals.push(opening_amount); }
    if (parent_group_id !== undefined) { sets.push('group_id = ?'); vals.push(parent_group_id); }

    if (!sets.length) {
        return res.status(400).json({ message: 'No fields provided to update.' });
    }
    vals.push(id);

    try {
        const info = db.prepare(`
      UPDATE masteraccount
      SET ${sets.join(', ')}
      WHERE masteraccount_id = ?
    `).run(...vals);

        if (info.changes === 0) {
            return res.status(404).json({ message: 'Account not found.' });
        }
        return res.json({ message: 'Updated.' });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: 'Could not update account.' });
    }
});

// ─── 5) DELETE a master account ───
app.delete('/masteraccounts/:id', (req, res) => {
    const id = Number(req.params.id);
    try {
        const info = db.prepare(`
      DELETE FROM masteraccount
      WHERE masteraccount_id = ?
    `).run(id);

        if (info.changes === 0) {
            return res.status(404).json({ message: 'Account not found.' });
        }
        return res.json({ message: 'Deleted.' });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: 'Could not delete account.' });
    }
});

// ─── 6) Enhance GET /groups to include category_name ───
app.get('/groups', (req, res) => {
    try {
        const rows = db.prepare(`
      SELECT
        g.group_id,
        g.name,
        g.parent_masteraccount_id,
        g.parent_group_id,
        g.category_id,
        c.name AS category_name
      FROM "group" g
      JOIN accountcategory c
        ON g.category_id = c.accountcategory_id
    `).all();

        return res.json({ groups: rows });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: 'Could not fetch groups.' });
    }
});



// 7) Start server
const PORT = 5000;
app.listen(PORT, () => console.log(`Server listening on port ${PORT}`));