const { Model, DataTypes } = require('sequelize');
const sequelize = require('../db');

class Article extends Model {}

Article.init({
    username: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    text: {
        type: DataTypes.STRING(40000),
        allowNull: false,
    },
    title: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    photo: {
        type: DataTypes.STRING,
        defaultValue: '',
    }
}, {
    sequelize,
    modelName: 'articles',
    timestamps: true,
    freezeTableName: true,
});

module.exports = Article;
