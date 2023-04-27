const express = require('express');
const userRoute = require('./user/user')
const authRoute= require('./login/route')
const bodyParser = require('body-parser');
const morgan = require('morgan');
require('dotenv').config();
const app = express();
app.use(bodyParser.json());
app.use(morgan('combined'))
app.use('/auth',authRoute)
// Dùng userRoute cho tất cả các route bắt đầu bằng '/user'
app.use('/user', userRoute);
// Khởi động server
app.listen(3000, () => {
    console.log('Server is running on port 3000 duy');
});
