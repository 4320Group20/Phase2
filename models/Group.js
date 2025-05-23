const db = require('../db');

/**
 * Group Model
 * 
 * Provides functions for managing groups in the database:
 * - `getAllGroupsWithCategories`: Retrieves all groups along with their associated category names.
 * - `createGroup`: Inserts a new group into the database with category and parent group associations.
 * - `getGroupByID`: Retrieves a specific group by its ID.
 * - `updateGroup`: Updates the name and other properties of an existing group.
 * - `deleteGroup`: Deletes a group by its ID.
 * 
 * Each function interacts with the database and returns the result of the operation.
 */


module.exports = {
    getAllGroupsWithCategories: () => {
        const gs = db.prepare(`
            SELECT
              g.group_id,
              g.name,
              g.category_id,
              c.name AS category_name,
              g.parent_group_id
            FROM "group" g
            JOIN accountcategory c
              ON g.category_id = c.accountcategory_id`
        ).all();
        return gs;
    },

    createGroup: (name, category_id, parent_group_id) => {
        const info = db.prepare(`
            INSERT INTO "group" (name, category_id, parent_group_id)
            VALUES (?, ?, ?)`
        ).run(name, category_id, parent_group_id || null);

        return info;
    },

    getGroupByID: (id) => {
        const g = db.prepare(`
            SELECT
              group_id, name, category_id, parent_group_id
            FROM "group"
            WHERE group_id = ?`
        ).get(id);

        return g;
    },

    updateGroup: (sets, vals) => {
        const info = db.prepare(`
            UPDATE "group"
            SET ${sets.join(', ')}
            WHERE group_id = ?`
        ).run(...vals);

        return info;
    },

    deleteGroup: (id) => {
        const info = db.prepare(`
            DELETE FROM "group"
            WHERE group_id = ?`
        ).run(id);

        return info;
    }
};
