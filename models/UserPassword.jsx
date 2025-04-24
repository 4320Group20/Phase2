


class UserPassword {
    constructor(id, userName, encryptedPassword, passwordExpiryTime, userAccountExpiryDate) {

        // This is the primary key of the UserPassword class. The value of this attribute need to be the same as the value of the iFINANCE user ID.
        // Type String
        this.id = id;

        // The name attribute stores the use account name of the non admin user.
        // Type String
        this.userName = userName;

        // The userEncryptedPassword attribute stores the encrypted version of the non admin user password.
        // A salted hash will be used in order to encrypt the password.
        // Type String
        this.encryptedPassword = encryptedPassword;

        // From time to time the system requires the user to change the password. The
        // passwordExpiryTime attribute stores this period of time.
        // Type Integer
        this.passwordExpiryTime = passwordExpiryTime;

        //The userAccountExpiryDate attribute stores the expiry date of the user account if any.
        // Type Date
        this.userAccountExpiryDate = userAccountExpiryDate;

    }

}

export default UserPassword;