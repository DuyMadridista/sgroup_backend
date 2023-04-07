const express = require('express');
const user_router = express.Router();
const validateUser = require('./midleware').validateUser;
// Danh sách user
let users = [
    {
        id: 1,
        fullname: 'Nguyen Huy Tuong',
        gender: true,
        age: 18
    },
    {
        id: 2,
        fullname: 'Nguyen Thi Tuong',
        gender: false,
        age: 15
    }
];

// Lấy danh sách user
user_router.get('/', (req, res) => {
    res.status(200).json(users);
});

// Lấy chi tiết user
user_router.get('/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const user = users.find(u => u.id === id);

    if (user) {
        res.status(200).json(user);
    } else {
        res.status(404).json({ message: 'User not found' });
    }
});

// Cập nhật thông tin user
user_router.put('/:id',validateUser, (req, res,) => {
    const id = parseInt(req.params.id);
    const index = users.findIndex(u => u.id === id);

    if (index !== -1) {
        users[index] = { id, ...req.body };
        res.status(204).send();
    } else {
        res.status(404).json({ message: 'User not found' });
    }
});

// Thêm user mới
user_router.post('/',validateUser, (req, res) => {
    let id;
    if (!req.body.id) {  id = users[users.length-1].id + 1 }
    else { id = parseInt(req.body.id) };
    const isUserExists = users.some((user) => user.id === id);
    if (isUserExists) {
      // nếu user đã tồn tại, trả về lỗi 409 Conflict
        res.status(409).send("User already exists");
        return;
    }
    const newUser = { id, ...req.body };
    users.push(newUser);
    res.status(201).json(newUser);
});

// Xóa user
user_router.delete('/:id', (req, res) => {
    const id = parseInt(req.params.id);
    users = users.filter(u => u.id !== id);
    res.status(204).send();
});
// Exports cho biến user_router
module.exports = user_router;