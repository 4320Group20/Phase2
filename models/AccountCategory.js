const db = require('../db');

/**
 * AccountCategory Model
 * 
 * Provides functions for managing account categories in the database:
 * - `createAccountCategory`: Inserts a new account category into the database.
 * - `getAllCategories`: Retrieves all account categories from the database.
 * - `getCategoryById`: Retrieves a specific account category by ID.
 * - `updateCategory`: Updates the name and type of an existing account category.
 * - `deleteCategory`: Deletes an account category by ID.
 * 
 * Each function interacts with the database and returns the result of the operation.
 */

module.exports = {
    createAccountCategory: (categoryData) => {
        const query = db.prepare(`
            INSERT INTO accountcategories (id, name, type)
            VALUES (?, ?, ?)
        `);
        query.run(
            categoryData.id,
            categoryData.name,
            categoryData.type
        );
        return { id: categoryData.id, ...categoryData };
    },

    getAllCategories: () => {
        const query = db.prepare(`SELECT * FROM accountcategories`);
        return query.all();
    },

    getCategoryById: (id) => {
        const query = db.prepare(`SELECT * FROM accountcategories WHERE id = ?`);
        return query.get(id);
    },

    updateCategory: (id, newData) => {
        const query = db.prepare(`
            UPDATE accountcategories
            SET name = ?, type = ?
            WHERE id = ?
        `);
        query.run(
            newData.name,
            newData.type,
            id
        );
        return { id, ...newData };
    },

    deleteCategory: (id) => {
        const query = db.prepare(`DELETE FROM accountcategories WHERE id = ?`);
        const result = query.run(id);
        return { deleted: result.changes > 0 };
    }
};
