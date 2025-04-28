const db = require('../db');
/**
 * MasterAccount Model
 * 
 * Provides functions for managing master accounts in the iFINANCE system:
 * - `getAll`: Retrieves all master accounts from the database.
 * - `create`: Inserts a new master account into the database.
 * - `getByID`: Retrieves a specific master account by ID.
 * - `update`: Updates the name, opening amount, closing amount, and parent group of an existing master account.
 * - `delete`: Deletes a master account by ID.
 * 
 * Each function interacts with the database and returns the result of the operation.
 */


module.exports = {
    getAll: () => {
        const rows = db.prepare(`
            SELECT
              m.masteraccount_id   AS masteraccount_id,
              m.name               AS name,
              m.opening_amount     AS opening_amount,
              m.closing_amount     AS closing_amount,
              m.group_id           AS parent_group_id
            FROM masteraccount m`
        ).all();

        return rows;
    },

    create: (name, opening_amount, parent_group_id) => {
        const info = db.prepare(`
            INSERT INTO masteraccount (name, opening_amount, closing_amount, group_id)
            VALUES (?, ?, ?, ?)`
        ).run(name, opening_amount, opening_amount, parent_group_id || null);

        return info;
    },

    getByID: (id) => {
        const account = db.prepare(`
            SELECT masteraccount_id, name, opening_amount, closing_amount, group_id AS parent_group_id
            FROM masteraccount
            WHERE masteraccount_id = ?`
        ).get(id);

        return account;
    },

    update: (sets, vals) => {
        const info = db.prepare(`
            UPDATE masteraccount
            SET ${sets.join(', ')}
            WHERE masteraccount_id = ?`
        ).run(...vals);

        return info;
    },

    delete: (id) => {
        const info = db.prepare(`
            DELETE FROM masteraccount
            WHERE masteraccount_id = ?`
        ).run(id);

        return info;
    }
};
