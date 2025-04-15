

class Group {
    constructor(id, name) {
        
        // This is the primary key of the Group class. The value of this attribute
        // distinguishes one account group from the other.
        // Type String
        this.id = id;
        
        // The name attribute stores the name of the group or its subgroups.
        // Type String
        this.name = name;
    }

    // Method to return group details as a string
    toString() {
        return `ID: ${this.id}, Name: ${this.name}`;
    }
}

export default Group;
