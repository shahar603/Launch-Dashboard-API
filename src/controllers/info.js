const Api = require("../models/api");



module.exports = {
        api: function(req, res, next){
            Api.findOne({}, "api_info").then(
            function(result){
                if (!result)
                    throw {status: 404, message: "Not Found"};

                res.send(result.api_info);
            }).catch(next);
        },


        versions: function(req, res, next){
            Api.findOne({}, "versions").
            then(function(result){
                if (!result)
                    throw {status: 404, message: "Not Found"};

                res.send(result.versions[0]);
            }).catch(next);
        },


        // Add API info to the database
        addApiInfo: function(req, res, next){
            Api.create(req.body).
                then(function(result){
                    res.send(result);
                }).
                catch(next);
        },

        updateApiInfo: function(req, res, next){
            Api.findOneAndUpdate({}, req.body).
                then(function(result){
                    res.send(result);
                }).
                catch(next);
        },
};
