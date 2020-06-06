const express = require('express');
const userRouter = require('./router/users');

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(userRouter);

app.listen(3000, () => {
    console.log('Server listening on 3000')
})