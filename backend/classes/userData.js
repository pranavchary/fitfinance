class UserData {
  constructor(userID, firstName, lastName, userName, verified, lastLogin) {
    this.userID = userID;
    this.firstName = firstName;
    this.lastName = lastName;
    this.userName = userName;
    this.verified = verified === 1;
    this.lastLogin = lastLogin;
  }
}

module.exports = UserData;
