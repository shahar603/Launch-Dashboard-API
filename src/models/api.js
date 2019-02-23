const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const apiSchema = new Schema({
    api_info: String,
    versions: [{version: String, description: String}]
});

const Api = mongoose.model("api", apiSchema);

module.exports = Api;
