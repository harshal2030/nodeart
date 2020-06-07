const express = require('express');
const userRouter = require('./router/users');
const path = require('path');
const articleRouter = require('./router/article');

const publicPath = path.join(__dirname, './../public')

const app = express();

app.use(express.static(publicPath));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(userRouter);
app.use(articleRouter);

app.listen(3000, () => {
    console.log('Server listening on 3000')
})