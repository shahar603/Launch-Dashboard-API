const dynamo = require("dynamodb");
const Joi = require("joi");


const versionSchema = {
    project_name: Joi.string(),
    version: Joi.string(),
    project_link: Joi.string(),
    docs: Joi.string(),
    organization: Joi.string(),
    organization_link: Joi.string(),
    description: Joi.string()
};


const apiSchema = {
    hashKey : "id",

    schema: {
        id: dynamo.types.uuid(),
        api_info: Joi.string(),
        versions: Joi.array().items(versionSchema)
    }
};

const Api = dynamo.define("Api", apiSchema);

module.exports = Api;
