const express = require('express');
const { auth } = require('./../middleware/auth');
const multer = require('multer');
const { imgPath } = require('../utils/path');
const { v4 } = require('uuid');
const Article = require('../models/article');
const sharp = require('sharp');
const sequelize = require('../db');

const router = express.Router();

const upload = multer({
    limits: {
      fileSize: 20 * 1000000,
    },
    fileFilter(req, file, cb) {
      if (!file.originalname.match(/\.(jpg|jpeg|png|mp4|mkv)$/)) {
        return cb(Error('Unsupported files uploaded to the server'));
      }
  
      return cb(undefined, true);
    },
});
  
  const mediaMiddleware = upload.fields([
    { name: 'image', maxCount: 1 },
]);

router.post('/article', auth, mediaMiddleware, async (req, res) => {
    try {
        const article = JSON.parse(req.body.info);
        article.username = req.user.username;

        const file = req.files;
        
        if (file.image !== undefined) {
            const filename = `${v4()}.png`;
            const filePath = `${imgPath}/${filename}`;
            await sharp(file.image[0].buffer).png().toFile(filePath);
            article.photo = `${filename}`;
        }

        await Article.create(article);
        res.sendStatus(200)
    } catch (e) {
      console.log(e);
      res.sendStatus(400);
    }
})

router.get('/article', auth, async (req, res) => {
    try{
        const result = await sequelize.query(`SELECT users.avatar, articles.title, articles.photo, 
        articles.username, articles.id
        FROM articles INNER JOIN users USING (username) WHERE username=:username
        UNION ALL
        SELECT users.avatar, articles.title, articles.photo, articles.username, articles.id
        FROM articles INNER JOIN users USING (username) WHERE username!=:username`, {
            replacements: {username: req.user.username},
            raw: true,
        });

        res.send(result[0]);
    } catch (e) {
        console.log(e);
        res.sendStatus(400);
    }
})

router.get('/article/:id', auth, async (req, res) => {
    try {
        const result = await sequelize.query(`SELECT users.avatar, articles.* FROM articles INNER JOIN 
        users USING (username) WHERE articles.id = :id`, {
            replacements: {id: req.params.id},
            raw: true,
        });

        res.send(result[0][0]);
    } catch (e) {
        console.log(e);
        res.sendStatus(400);
    }
})

module.exports = router;
