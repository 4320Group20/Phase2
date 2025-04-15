// models/Administrator.js

import iFinanceUser from './iFinanceUser';

//TODO: Decide if this needs to be extending NonAdminUser instead so it also has an address and email.
class Administrator extends iFinanceUser {
    constructor(id, name, dateHired, dateFinished) {
        // See type: iFinanceUser ==> both id and name are Strings
        super(id, name);

        // The date when the system administrator is hired by iFINANCE.
        // Type Date
        this.dateHired = new Date(dateHired);

        // The date when the system administrator left iFINANCE.
        // Type Date
        this.dateFinished = new Date(dateFinished);
    }
}

export default Administrator;
