const express = require('express');
const user_router = express.Router();
const validateUser = require('../midleware/checkUser').validateUser;
//const connection = require("../database/connection");
const knex = require("../database/knex");
const jsonwebtoken = require('jsonwebtoken');
const date = new Date();
const env = require('dotenv');
env.config();

// Lấy danh sách user
user_router.get('/', (req, res) => {
    let pageNumber = req.query.page;
    const PAGE_SIZE = 2;
    if (pageNumber) {
        // pagination
        pageNumber = parseInt(pageNumber) - 1;
        if (pageNumber > 0) {
            const skip = pageNumber * PAGE_SIZE
            knex.select('*').from('user').limit(PAGE_SIZE).offset(skip)
                .then((result) => {
                    res.send(result);
                }).catch((err) => {
                    throw err;
                });
        }
        else {
            res.status(400).send("Số trang không hợp lệ");
        }
    }
    else {
        //get all
        knex.select('*').from('user')
            .then((result) => {
                res.send(result);
            }).catch((err) => {
                throw err;
            });
    }

});
// search by name
user_router.get('/search/:name', (req, res) => {
    const name = req.params.name;
    knex.select('*').from('user').where('name', 'like', `%${name}%`)
        .then((result) => {
            res.send(result);
        }).catch((err) => {
            throw err;
        });
})
// Lấy chi tiết user
user_router.get('/id/:id', (req, res) => {
    const id = parseInt(req.params.id);
    knex.select('*').from('user').where('id', id).then((result) => {
        res.send(result);
    }).catch((err) => {
        throw err;
    });
});
//console.log(process.env.secretKey);
// Thêm user mới
user_router.post('/', validateUser, (req, res) => {
    const author1 = req.headers.authorization;
    const author = author1.substring(7);
    //console.log(author);
    // add biến môi trường ?????/
    const id = jsonwebtoken.verify(author, process.env.secretKey).id;
    //console.log(id);

    const { name, age, gender, password, email, username } = req.body;
    if (id) {
        knex('user').insert({
            name: name,
            age: age,
            gender: gender,
            password: password,
            email: email,
            username: username,
            CreatedAt: date.toISOString().slice(0, 19).replace('T', ' '),
            createdby: id
        }).then(() => {
            res.status(200).json({ message: 'User added' });
        }).catch((err) => {
            console.log(err);
            res.status(404).json({ message: 'User not found' });
        });
    }
});
// Cập nhật thông tin user
user_router.put('/:id', validateUser, (req, res,) => {
    const id = parseInt(req.params.id);
    knex('user').where('id', id).update({
        name: req.body.name,
        age: req.body.age,
        gender: req.body.gender,
        email: req.body.email,
        username: req.body.username,
        CreatedAt: date.toISOString().slice(0, 19).replace('T', ' ')
    }).then(() => {
        res.status(200).json({ message: 'User updated' });
    }).catch((err) => {
        console.log(err);
        res.status(404).json({ message: 'User not found' });
    });
});

// Xóa user
user_router.delete('/:id', (req, res) => {
    const id = parseInt(req.params.id);
    knex('user').where('id', id).del().then(() => {
        res.status(200).json({ message: 'User deleted' });
    }).catch((err) => {
        console.log(err);
        res.status(404).json({ message: 'User not found' });
    });
});
// Exports cho biến user_router
module.exports = user_router;




// Cập nhật thông tin user
// user_router.put('/:id', validateUser, (req, res,) => {
//     const id = parseInt(req.params.id);
//     connection.query("UPDATE user SET name = ?, age = ?, gender=?, class_id = ? WHERE id = ?", [req.body.name, req.body.age, req.body.gender, req.body.class_id, id],
//         (err, result) => {
//             if (err) res.status(404).json({ message: 'User not found' });
//             else res.status(200).json({ message: 'User updated' });
//         })
// });
// Xóa user
// user_router.delete('/:id', (req, res) => {
//     const id = parseInt(req.params.id);
//     connection.query("DELETE FROM user WHERE id = ?", [id],
//         (err, result) => {
//             if (err) res.status(404).json({ message: 'User not found' });
//             else res.status(200).json({ message: 'User deleted' });
//         })
// });