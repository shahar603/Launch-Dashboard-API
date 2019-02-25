const mongoose = require("mongoose");
const Schema = mongoose.Schema;


const versionSchema = new Schema({
    project_name: String,
    version: String,
    project_link: String,
    docs: String,
    organization: String,
    organization_link: String,
    description: String
}, { _id : false });


const apiSchema = new Schema({
    api_info: String,
    versions: [versionSchema]
});

const Api = mongoose.model("api", apiSchema);

module.exports = Api;
