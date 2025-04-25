
import Group from '../models/Group';
import AccountCategory from '../models/AccountCategory';

class CustomGroupController {
    constructor() {
        // Simulated data from the database
        this.groups = []; // Will contain Group objects
        this.categories = []; // Will contain AccountCategory objects
    }

    // Fetch all groups organized by category type (e.g., Assets, Liabilities)
    getTreeViewData() {
        const tree = {};

        this.categories.forEach(category => {
            tree[category.name] = this.groups
                .filter(group => group.categoryId === category.ID)
                .map(group => ({ id: group.id, name: group.name }));
        });

        return tree;
    }

    // Add a new group
    addGroup(id, name, categoryId) {
        const newGroup = new Group(id, name);
        newGroup.categoryId = categoryId; // Temporarily extend Group with categoryId
        this.groups.push(newGroup);
        return newGroup;
    }

    // Edit an existing group's name
    editGroup(groupId, newName) {
        const group = this.groups.find(g => g.id === groupId);
        if (!group) throw new Error('Group not found');
        group.name = newName;
        return group;
    }

    // Delete a group by ID
    deleteGroup(groupId) {
        const index = this.groups.findIndex(g => g.id === groupId);
        if (index === -1) throw new Error('Group not found');
        const removed = this.groups.splice(index, 1)[0];
        return removed;
    }

    // Load sample data (simulating a database fetch)
    loadSampleData() {
        this.categories = [
            new AccountCategory('1', 'Assets', 'Debit'),
            new AccountCategory('2', 'Liabilities', 'Credit'),
            new AccountCategory('3', 'Income', 'Credit'),
            new AccountCategory('4', 'Expenses', 'Debit'),
        ];

        this.groups = [
            Object.assign(new Group('g1', 'Cash'), { categoryId: '1' }),
            Object.assign(new Group('g2', 'Bank'), { categoryId: '1' }),
            Object.assign(new Group('g3', 'Accounts Payable'), { categoryId: '2' }),
            Object.assign(new Group('g4', 'Salaries'), { categoryId: '4' }),
        ];
    }
}

export default CustomGroupController;
