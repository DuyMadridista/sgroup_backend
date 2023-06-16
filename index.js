const express = require('express');
const userRoute = require('./userManager/userManager')
const authRoute = require('./login/route')
const pollRoute = require('./poll/poll')
const pollClient= require('./poll/pollClient')
const bodyParser = require('body-parser');
const morgan = require('morgan');
require('dotenv').config();
const app = express();
app.use(bodyParser.json());
app.use(morgan('combined'))
app.use('/auth',authRoute)
// Dùng userRoute cho tất cả các route bắt đầu bằng '/user'
app.use('/user', userRoute);
// poll
app.use('/poll', pollRoute);
//pollClient
app.use('/pollClient', pollClient);
// Khởi động server
app.listen(3000, () => {
    console.log('Server is running on port 3000 duy');
});
