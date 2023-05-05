const secretKey = 'duySgroupSecret';
const jsonwebtoken = require('jsonwebtoken');
const { hashPass } = require('../../helper/hashing')
class UserService {
    constructor(db) {
        this.db = db;
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
            "UPDATE user SET name = ?, age = ?, gender = ? WHERE id = ?",
            [data.name, data.age, data.gender, userId]
        );

        if (result.affectedRows === 0) {
            throw new Error('User not found');
        }
    }
}
//comment
module.exports = UserService;