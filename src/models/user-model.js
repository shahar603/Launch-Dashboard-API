const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema({
    username: String,
    googleId: String
});

const User = global.connectionV1.model("user", userSchema);

module.exports = User;
