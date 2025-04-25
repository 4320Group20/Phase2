import React, { useState } from 'react';

const AccountGroupsControl = () => {
    const [accountGroups, setAccountGroups] = useState([]); // To store groups
    const [selectedNode, setSelectedNode] = useState(null); // To keep track of the selected node
    const [groupName, setGroupName] = useState(''); // To manage the new group name
    const [errorMessage, setErrorMessage] = useState(''); // For displaying error messages

    // Sample data for account categories and groups (this would usually come from an API)
    const accountCategories = [
        { ID: 1, name: 'Assets' },
        { ID: 2, name: 'Liabilities' },
        { ID: 3, name: 'Equity' },
    ];

    const groups = [
        { ID: 1, name: 'Current Assets', parent: null, categoryID: 1, subGroups: [] },
        { ID: 2, name: 'Cash', parent: 1, categoryID: 1, subGroups: [] },
        { ID: 3, name: 'Long-Term Liabilities', parent: null, categoryID: 2, subGroups: [] },
    ];

    // Functions for button actions
    const handleAddGroup = () => {
        if (!groupName.match(/^[a-zA-Z0-9]+$/)) {
            setErrorMessage('Invalid group name');
            return;
        }

        if (!selectedNode) {
            setErrorMessage('Please select a category or group');
            return;
        }

        const newGroup = {
            ID: groups.length + 1,
            name: groupName,
            parent: selectedNode.ID,
            categoryID: selectedNode.categoryID,
            subGroups: [],
        };

        // If the selected node is a group, add the new group as its subgroup
        if (selectedNode.subGroups) {
            selectedNode.subGroups.push(newGroup);
        }

        // Add the new group to the main groups array
        setAccountGroups([...accountGroups, newGroup]);

        // Clear the group name input
        setGroupName('');
    };

    const handleRemoveGroup = () => {
        if (!selectedNode) {
            setErrorMessage('Please select a group to remove');
            return;
        }

        // Ensure the group can be deleted (no sub-groups)
        if (selectedNode.subGroups && selectedNode.subGroups.length > 0) {
            setErrorMessage('Cannot remove group with sub-groups');
            return;
        }

        const updatedGroups = accountGroups.filter((group) => group.ID !== selectedNode.ID);
        setAccountGroups(updatedGroups);
        setSelectedNode(null);
    };

    const handleChangeName = () => {
        if (!selectedNode) {
            setErrorMessage('Please select a group to edit');
            return;
        }

        const newName = prompt('Enter new name for the group', selectedNode.name);
        if (newName && newName.trim() !== '') {
            setAccountGroups(
                accountGroups.map((group) =>
                    group.ID === selectedNode.ID ? { ...group, name: newName } : group
                )
            );
        }
    };

    const handleNodeSelect = (node) => {
        setSelectedNode(node);
        setErrorMessage('');
    };

    return (
        <div style={styles.container}>
            <h2 style={styles.title}>Account Groups Management</h2>

            {errorMessage && <div style={styles.errorContainer}>{errorMessage}</div>}

            <div style={styles.treeContainer}>
                <h3>Account Categories</h3>
                <ul style={styles.tree}>
                    {accountCategories.map((category) => (
                        <li key={category.ID} onClick={() => handleNodeSelect(category)} style={styles.treeNode}>
                            {category.name}
                            <ul>
                                {groups
                                    .filter((group) => group.categoryID === category.ID)
                                    .map((group) => (
                                        <li key={group.ID} onClick={() => handleNodeSelect(group)} style={styles.treeNode}>
                                            {group.name}
                                            {group.subGroups.length > 0 && (
                                                <ul>
                                                    {group.subGroups.map((subGroup) => (
                                                        <li
                                                            key={subGroup.ID}
                                                            onClick={() => handleNodeSelect(subGroup)}
                                                            style={styles.treeNode}
                                                        >
                                                            {subGroup.name}
                                                        </li>
                                                    ))}
                                                </ul>
                                            )}
                                        </li>
                                    ))}
                            </ul>
                        </li>
                    ))}
                </ul>
            </div>

            <div style={styles.controls}>
                <input
                    type="text"
                    value={groupName}
                    onChange={(e) => setGroupName(e.target.value)}
                    placeholder="Enter group name"
                    style={styles.input}
                />
                <button onClick={handleAddGroup} style={styles.button}>Add Group</button>
                <button onClick={handleRemoveGroup} style={styles.button}>Remove Group</button>
                <button onClick={handleChangeName} style={styles.button}>Change Group Name</button>
            </div>
        </div>
    );
};

const styles = {
    container: {
        padding: '2rem',
        backgroundColor: 'rgba(255, 255, 255, 0.85)',
        borderRadius: '12px',
        maxWidth: '800px',
        margin: '0 auto',
        textAlign: 'center',
    },
    title: {
        fontSize: '2.5rem',
        fontWeight: 'bold',
        marginBottom: '2rem',
    },
    errorContainer: {
        color: 'red',
        marginBottom: '1rem',
    },
    treeContainer: {
        maxHeight: '300px',
        overflowY: 'auto',
        textAlign: 'left',
        marginBottom: '2rem',
    },
    tree: {
        listStyleType: 'none',
        paddingLeft: '20px',
        textAlign: 'left',
    },
    treeNode: {
        cursor: 'pointer',
        padding: '5px',
    },
    controls: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '1rem',
    },
    input: {
        padding: '1rem',
        fontSize: '1rem',
        width: '80%',
        marginBottom: '1rem',
        borderRadius: '8px',
        border: '1px solid #ccc',
    },
    button: {
        backgroundColor: '#28a745',
        color: '#fff',
        padding: '0.75rem 1.5rem',
        borderRadius: '8px',
        fontSize: '1.2rem',
        cursor: 'pointer',
        width: '200px',
    },
};

export default AccountGroupsControl;
