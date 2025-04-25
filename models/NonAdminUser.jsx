import iFinanceUser from './iFinanceUser';



class NonAdminUser extends iFinanceUser {
    constructor(id, name, address, email) {
        // See type: iFinanceUser ==> both id and name are Strings
        super(id, name);
        
        // The address attribute stores the address of the iFINANCE non admin user.
        // Type String
        this.address = address;
        
        // The email attribute stores the email address of birth of the iFINANCE non admin user.
        // Type String
        this.email = email;
    }
}

export default NonAdminUser;
