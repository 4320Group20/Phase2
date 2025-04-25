const db = require('../db');

module.exports = {
    createAccountCategory: async (categoryData) => {
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

    getAllCategories: async () => {
        const query = db.prepare(`SELECT * FROM accountcategories`);
        return query.all();
    },

    getCategoryById: async (id) => {
        const query = db.prepare(`SELECT * FROM accountcategories WHERE id = ?`);
        return query.get(id);
    },

    updateCategory: async (id, newData) => {
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

    deleteCategory: async (id) => {
        const query = db.prepare(`DELETE FROM accountcategories WHERE id = ?`);
        const result = query.run(id);
        return { deleted: result.changes > 0 };
    }
};
