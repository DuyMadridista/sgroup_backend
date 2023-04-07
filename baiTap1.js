const express = require('express');
const userRoute = require('./user/user')

const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.json());
// Dùng userRoute cho tất cả các route bắt đầu bằng '/user'
app.use('/user', userRoute);
// Khởi động server
app.listen(3000, () => {
    console.log('Server is running on port 3000 duy');
});
