const Api = require("../../models/api");



module.exports = {
        versions: function(req, res, next){
            Api.findOne({ version: "1.0.0" }, "versions").
            then(function(result){
                if (!result)
                    throw {status: 404, message: "Not Found"};

                res.send(result.versions[0]);
            }).catch(next);
        }
};
