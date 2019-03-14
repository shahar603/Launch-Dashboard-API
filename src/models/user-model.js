const dynamo = require("dynamodb");
const Joi = require("joi");



const userSchema = {
    hashKey : "googleId",

    schema: {
        username: Joi.string(),
        googleId: Joi.string()
    },

    tableName: "users"
};

const User = dynamo.define("User", userSchema);


module.exports = User;
