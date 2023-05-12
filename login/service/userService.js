const secretKey = 'duySgroupSecret';
const jsonwebtoken = require('jsonwebtoken');
const { hashPass } = require('../../helper/hashing')
class UserService {
    constructor(db) {
        this.db = db;
    }
    async updatePass(email,password) {
        const { hashPassword, salt } = hashPass(password);
        const result = await this.db.promise().query(
            'update user set password = ?, salt = ?, passwordResetToken = null, passwordResetExpiration = null  where email = ?',
            [hashPassword, salt, email]
        );
    }
    async registerUser(user) {
        // Check if username is already exist
        
        const rows = await this.db.promise().query(
            'select * from user where username=?', [user.username]
        );
        console.log(rows[0]);
        if (rows[0].length > 0) {
            throw new Error('Username already exists');
        }
        // hash password
        const { hashPassword, salt } = hashPass(user.password);

        // insert user into database
        const result = await this.db.promise().query(
            `insert into user(username,name,salt,password,age,email,gender) value(?,?,?,?,?,?,?)`,
            [
                user.username,
                user.name,
                salt,
                hashPassword,
                user.age,
                user.email,
                user.gender,
            ]
        );
        console.log("duy +" + result);
        if (result.affectedRows === 0) {
            throw new Error('Failed to register user');
        }
    }

    async loginUser(username, password) {
        // Check if the user exists
        const rows = await this.db.promise().query(
            'select * from user where username=?', [username]
        );
        
        const row = rows[0];
        const user = row[0];
        console.log(user);
        if (!user) {
            throw new Error('User not found');
        }
        // Check if the password is correct
        const hashPassword = hashPass(password, user.Salt).hashPassword;
        if (hashPassword !== user.password) {
            throw new Error('Incorrect password');
        }

        // Create and return token
        const token = jsonwebtoken.sign({
            id: user.id,
            username: user.username,
            name: user.name,
            age: user.age,
            email: user.email,
            gender: user.gender
        }, secretKey);

        return token;
    }

    async updateUser(userId, data) {
        const result = await this.db.promise().query(
            "UPDATE user SET name = ?, age = ?, gender = ? , passwordResetExpiration= ?, passwordResetToken= ? WHERE id = ?",
            [data.name, data.age, data.gender, data.passwordResetExpiration, data.passwordResetToken, userId]
        );

        if (result.affectedRows === 0) {
            throw new Error('User not found');
        }
    }
    async getEmail(email) {
        const rows = await this.db.promise().query(
            'select * from user where email=?', [email]
        );
        const user = rows[0];
        //console.log(user);
        if (!user) {
            throw new Error('User not found');
        }
        return user;
    }
    async createRandomToken() {
        const token = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
        return token;
    }
    async FindUserToResetPass(email, passwordResetToken) {
        const result = await this.db.promise().query(
            'SELECT * FROM user WHERE email = ? AND passwordResetToken = ?  ',
            [email, passwordResetToken, new Date(Date.now())]
        );
        if (result.affectedRows === 0) {
            throw new Error('User not found');
        }
        const users = result[0];
        const user = users[0];
        return user
    }
}
//comment
module.exports = UserService;