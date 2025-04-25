const db = require('../db');

module.exports = {
    createGroup: async (groupData) => {
        const query = db.prepare(`
            INSERT INTO groups (id, name)
            VALUES (?, ?)
        `);
        query.run(groupData.id, groupData.name);
        return { id: groupData.id, ...groupData };
    },

    getAllGroups: async () => {
        const query = db.prepare(`SELECT * FROM groups`);
        return query.all();
    },

    getGroupById: async (id) => {
        const query = db.prepare(`SELECT * FROM groups WHERE id = ?`);
        return query.get(id);
    },

    updateGroup: async (id, newData) => {
        const query = db.prepare(`
            UPDATE groups
            SET name = ?
            WHERE id = ?
        `);
        query.run(newData.name, id);
        return { id, ...newData };
    },

    deleteGroup: async (id) => {
        const query = db.prepare(`DELETE FROM groups WHERE id = ?`);
        const result = query.run(id);
        return { deleted: result.changes > 0 };
    }
};
