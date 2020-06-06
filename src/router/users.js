const express = require('express');

const User = require('./../models/user');

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

module.exports = router;
