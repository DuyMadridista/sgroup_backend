const express = require('express');
const userRoute = require('./userManager/userManager')
const authRoute = require('./login/route')
const pollRoute = require('./poll/poll')
const pollClient= require('./poll/pollClient')
const bodyParser = require('body-parser');
const morgan = require('morgan');
const roleRoute = require('./roleManagerment/roleRoute');
require('dotenv').config();
const app = express();
app.use(bodyParser.json());
app.use(morgan('combined'))
// login-- self-manager
app.use('/auth',authRoute)
//User manager
app.use('/user', userRoute);
// poll
app.use('/poll', pollRoute);
//pollClient
app.use('/pollClient', pollClient);
//role manager
app.use('/role',roleRoute)
// Khởi động server
app.listen(3000, () => {
    console.log('Server is running on port 3000 duy');
});
