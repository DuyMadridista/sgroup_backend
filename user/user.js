const express = require('express');
const user_router = express.Router();
const validateUser = require('../midleware/checkUser').validateUser;
const connection = require("../database/connection");
// Danh sách user
// let users = [
//     {
//         id: 1,
//         fullname: 'Nguyen Huy Tuong',
//         gender: true,
//         age: 18
//     },
//     {
//         id: 2,
//         fullname: 'Nguyen Thi Tuong',
//         gender: false,
//         age: 15
//     }
// ];

// Lấy danh sách user
user_router.get('/', (req, res) => {
    connection.query("SELECT * FROM user", (err, result) => {
        if (err) throw err;

        res.send(result);
    });
});

// Lấy chi tiết user
user_router.get('/:id', (req, res) => {
    const id = parseInt(req.params.id);
    connection.query("SELECT * FROM user WHERE id = ?", [id], (err, result) => {
        if (err) res.status(404).json({ message: 'User not found' });
        else{
            res.status(200).json(result);
        } 
    })
});

// Cập nhật thông tin user
user_router.put('/:id', validateUser, (req, res,) => {
    const id = parseInt(req.params.id);
    connection.query("UPDATE user SET name = ?, age = ?, gender=?, class_id = ? WHERE id = ?", [req.body.name, req.body.age, req.body.gender, req.body.class_id, id],
        (err, result) => {
            if(err) res.status(404).json({ message: 'User not found' });
            else res.status(200).json({ message: 'User updated' });
    })
});

// Thêm user mới
user_router.post('/',validateUser, (req, res) => {
    connection.query("INSERT INTO user (name, age, gender, class_id) VALUES (?, ?, ?, ?)", [req.body.name, req.body.age, req.body.gender, req.body.class_id],
        (err, result) => {
            if(err) res.status(404).json({ message: 'User not found' });
            else res.status(200).json({ message: 'User added' });
    })
});

// Xóa user
user_router.delete('/:id', (req, res) => {
    const id = parseInt(req.params.id);
    connection.query("DELETE FROM user WHERE id = ?", [id],
    (err, result) => {
        if(err) res.status(404).json({ message: 'User not found' });
        else res.status(200).json({ message: 'User deleted' });
    })
});
// Exports cho biến user_router
module.exports = user_router;

