const db = require('../db');

/**
 * Group Model
 * 
 * Provides functions for managing groups in the database:
 * - `createGroup`: Inserts a new group into the database.
 * - `getAllGroups`: Retrieves all groups from the database.
 * - `getGroupById`: Retrieves a specific group by ID.
 * - `updateGroup`: Updates the name of an existing group.
 * - `deleteGroup`: Deletes a group by ID.
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
    }
};
