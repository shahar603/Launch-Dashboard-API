const s3 = require("../helpers/v1/s3_helper");
const keys = require("./keys");

module.exports = {
    setKeys: async () => {
        module.exports.pubKey = await s3.readFile(keys.jwt.pubKey);
        module.exports.priKey = await s3.readFile(keys.jwt.priKey);
    }
}
