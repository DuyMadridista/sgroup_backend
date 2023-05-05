const express = require('express');
const validateUser = require('../midleware/checkUser').validateUser;
const crypto = require('crypto');
const jsonwebtoken = require('jsonwebtoken');
const db = require("../database/connection");
const { hashPass } = require('../helper/hashing');
const UserService = require('./service/userService');
const UserController = require('./controller/userController');

const router = express.Router();
//const secretKey = 'duySgroupSecret';
const userService = new UserService(db);
const userController = new UserController(userService);

router.post('/register', validateUser, (req, res) => userController.register(req, res));
router.post('/login', (req, res) => userController.login(req, res));
router.put('/myuser/:id', validateUser, (req, res) => userController.update(req, res));

module.exports = router;
