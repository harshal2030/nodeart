const { Model, DataTypes } = require('sequelize');
const sequelize = require('./../db');

const jwt = require('jsonwebtoken');

class User extends Model {
    async genrateAuthToken() {
        const user = this;
        console.log(user);

        const token = jwt.sign({ username: user.username.toString() }, process.env.KEY);
        user.tokens.push(token);
        await user.save({ fields: ['tokens'] });
        return token;
    }

    removeSensetiveData() {
        const user = this.toJSON()

        return {
            username: user.username,
            avatar: user.avatar,
            bio: user.bio,
        }
    }
}

User.init({
    username: {
        type: DataTypes.STRING,
        unique: true,
        validate: {
            min: 5, 
        }
    },
    password: {
        type: DataTypes.STRING,
        validate: {
            min: 5,
        }
    },
    avatar: {
        type: DataTypes.STRING,
        defaultValue: 'default.png',
    },
    bio: {
        type: DataTypes.STRING,
    },
    tokens: {
        type: DataTypes.ARRAY(DataTypes.STRING),
        defaultValue: [],
    }
}, {
    sequelize,
    modelName: 'users',
    timestamps: true,
    freezeTableName: true,
})

sequelize.sync();

module.exports = User;
