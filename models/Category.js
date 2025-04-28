const { updateCategory } = require('../controllers/CategoryController');
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
    getAllCategories: () => {
        const cats = db.prepare(`
            SELECT accountcategory_id AS accountcategory_id, name, type
            FROM accountcategory`
        ).all();
        return cats;
    },

    createCategory: (name, type) => {
        const info = db.prepare(`
            INSERT INTO accountcategory (name, type)
            VALUES (?, ?)`
        ).run(name, type || null);

        return info;
    },

    getCategoryByID: (id) => {
        const cat = db.prepare(`
            SELECT accountcategory_id AS accountcategory_id, name, type
            FROM accountcategory
            WHERE accountcategory_id = ?`
        ).get(id);

        return cat;
    },

    updateCategory: (sets, vals) => {
        const info = db.prepare(`
            UPDATE accountcategory
            SET ${sets.join(', ')}
            WHERE accountcategory_id = ?`
        ).run(...vals);
        return info;
    },

    deleteCategory: (id) => {
        const info = db.prepare(`
            DELETE FROM accountcategory
            WHERE accountcategory_id = ?`
        ).run(id);

        return info;
    }
};
