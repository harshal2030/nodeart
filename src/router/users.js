const express = require('express');

const User = require('./../models/user');
const { auth } = require('./../middleware/auth')

const router = express.Router();

router.post('/users', async (req, res) => {
    try {
        console.log(req.body);
        const user = await User.create(req.body);
        const token = await user.genrateAuthToken();
        const userData = user.removeSensetiveData();
        res.send({ user: userData, token: token });
    } catch (e) {
        console.log(e);
        res.sendStatus(400);
    }
})

router.post('/users/login', async (req, res) => {
    try {
        const user = await User.findByCredentials(req.body.username, req.body.password);

        const token = await user.genrateAuthToken();
        const userData = user.removeSensetiveData();

        res.send({ user: userData, token });
    } catch (e) {
        console.log(e);
        res.sendStatus(400);
    } 
})

router.get('/users/:username', async (req, res) => {
    try {
        const user = await User.findOne({
            where: { username: req.params.username }
        });
        if (!user) {
            throw new Error('no such user')
        }

        res.send(user.removeSensetiveData());
    } catch (e) {
        res.sendStatus(400);
    } 
})

router.post('/users/logout', auth, async (req, res) => {
    try {
        req.user.tokens = req.user.tokens.filter((token) => token !== req.token);

        await User.update(req.user, {
          where: { username: req.user.username },
        });

        res.send();
    } catch (e) {
        res.sendStatus(400)
    }
});

module.exports = router;
