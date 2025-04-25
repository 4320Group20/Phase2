const db = require('../db');

module.exports = {
    createGroup: (groupData) => {
        const query = db.prepare(`
            INSERT INTO groups (id, name)
            VALUES (?, ?)
        `);
        query.run(groupData.id, groupData.name);
        return { id: groupData.id, ...groupData };
    },

    getAllGroups: () => {
        const query = db.prepare(`SELECT * FROM groups`);
        return query.all();
    },

    getGroupById: (id) => {
        const query = db.prepare(`SELECT * FROM groups WHERE id = ?`);
        return query.get(id);
    },

    updateGroup: (id, newData) => {
        const query = db.prepare(`
            UPDATE groups
            SET name = ?
            WHERE id = ?
        `);
        query.run(newData.name, id);
        return { id, ...newData };
    },

    deleteGroup: (id) => {
        const query = db.prepare(`DELETE FROM groups WHERE id = ?`);
        const result = query.run(id);
        return { deleted: result.changes > 0 };
    }
};
