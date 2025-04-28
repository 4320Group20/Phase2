const db = require('../db');

/**
 * Administrator Model
 * 
 * Provides functions for managing administrators in the database:
 * - `createAdministrator`: Inserts a new administrator into the database.
 * - `getAllAdministrators`: Retrieves all administrators from the database.
 * - `getAdministratorById`: Retrieves a specific administrator by ID.
 * - `updateAdministrator`: Updates the name, date hired, and date finished of an existing administrator.
 * - `deleteAdministrator`: Deletes an administrator by ID.
 * 
 * Each function interacts with the database and returns the result of the operation.
 */

module.exports = {
    createAdministrator:(adminData) => {
        const query = db.prepare(`
            INSERT INTO administrators (id, name, dateHired, dateFinished)
            VALUES (?, ?, ?, ?)
        `);
        query.run(
            adminData.id,
            adminData.name,
            adminData.dateHired,
            adminData.dateFinished
        );
        return { id: adminData.id, ...adminData };
    },

    getAllAdministrators: () => {
        const query = db.prepare(`SELECT * FROM administrators`);
        return query.all();
    },

    getAdministratorById: (id) => {
        const query = db.prepare(`SELECT * FROM administrators WHERE id = ?`);
        return query.get(id);
    },

    updateAdministrator: (id, newData) => {
        const query = db.prepare(`
            UPDATE administrators
            SET name = ?, dateHired = ?, dateFinished = ?
            WHERE id = ?
        `);
        query.run(
            newData.name,
            newData.dateHired,
            newData.dateFinished,
            id
        );
        return { id, ...newData };
    },

    deleteAdministrator: (id) => {
        const query = db.prepare(`DELETE FROM administrators WHERE id = ?`);
        const result = query.run(id);
        return { deleted: result.changes > 0 };
    }
};
