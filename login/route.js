const express = require('express');

const jsonwebtoken = require('jsonwebtoken');
const db = require("../database/connection");
const { hashPass } = require('../helper/hashing')
const router = express.Router()
router.post('/register', (req, res) => {
    const {
        username,
        password,
        name,
        age,
        email, gender
    } = req.body
    db.query(
        'select * from user where username=?', username,
        (err, rows) => {
            if (err) {
                return res.status(400).json({
                    message: "loi"
                });
            }
            // check if username is already exist
            const user = rows[0]
            if (user) {
                return res.status(400).json({
                    message: "user is already exist"
                });
            }
            // hash password
            const {
                hashPassword,
                salt,
            } = hashPass(password)
            //console.log(salt)
            // insert user into database
            db.query(
                `insert into user(username,name,salt,password,age,email,gender)
                value(?,?,?,?,?,?,?)`
                , [
                    username,
                    name,
                    salt,
                    hashPassword,
                    age,
                    email,
                    gender

                ],
                (err, rows) => {
                    if (err)
                        return res.status(500).json({
                            message: 'loi 2'
                        })
                    return res.status(200).json({
                        message: "register successfully"
                    })
                }
            )
        }
    )
})
router.post('/login', (req, res) => {
    const {
        username,
        password
    } = req.body
    db.query(
        'select * from user where username=?', [username],
        (err, rows) => {
            if (err) {
                return res.status(400).json({
                    message: "loi"
                });
            }
            // check if username is already exist
            const user = rows[0]
            //console.log(user)
            if (!user) {
                return res.status(400).json({
                    message: "user is not exist"
                });
            }
            // check password
            const hashPassword = hashPass(password, user.Salt).hashPassword
            //if password is not correct
            //console.log(hashPassword,user.Salt,"\n",user.password);
            if (hashPassword != user.password) {
                return res.status(400).json({
                    message: "password is not correct"
                });
            }
            // if password is correct
            // create token
            const token = jsonwebtoken.sign({
                id: user.id,
                username: user.username,
                name: user.name,
                age: user.age,
                email: user.email,
                gender: user.gender
            },
                'duySgroupSecret',// secret key
            )
            return res.status(200).json({
                message: "login successfully",
                token: token
            })
        }
    )
})

module.exports = router;



