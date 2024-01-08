class User {
  constructor({
    id,
    username,
    email,
    password,
    passwordHash,
    fullName = '',
    role = 'student', // could be 'student'/ 'teacher'
    contactNumber = '',
    status = 'active', // could be 'active'/ 'inactive'/ 'suspended'
  }) {
    this.id = id;
    this.username = username;
    this.email = email;
    this.password = password;
    this.passwordHash = passwordHash;
    this.fullName = fullName;
    this.role = role;
    this.contactNumber = contactNumber;
    this.status = status;
  }
}

module.exports = { User };
