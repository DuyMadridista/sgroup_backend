const express = require('express');
const app = express();
// app.use((req, res, next) => {
//     console.log('app.use')
//     next()
// })
// app.get('/', (req, res,next) => {
//     res.send('HeHEH')
//     next()
// });
app.use(express.json())
app.use(express.urlencoded())
app.post('/user', (req, res) => {
    console.log(req.query);
    console.log(req.params);
    console.log(req.body);
    res.status(200).json("req.params")
});
app.listen(4323, () => {
    console.log('Example app listening on port 4323')
});