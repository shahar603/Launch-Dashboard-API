const Api = require("../models/api");


module.exports = {
        api: function(req, res, next){
            Api.
            scan().
            loadAll().
            exec(function(err, result){
                try{
                    if (err || !result || !result.Count)
                        throw {status: 500, message: "Internal Server Error"};

                    result = result.Items.map((model) => model.attrs)[0];
                    res.send(result.api_info);
                }catch(err){
                    next(err);
                }
            });
        },


        versions: function(req, res, next){
            Api.
            scan().
            loadAll().
            exec(function(err, result){
                try{
                    if (err || !result || result.Count === 0 || !result.Items[0].attrs.versions)
                        throw {status: 500, message: "Internal Server Error"};

                    result = result.Items.map((model) => model.attrs)[0];
                    res.send(result.versions[0]);
                }catch(err){
                    next(err);
                }
            });
        },


        // Add API info to the database
        addApiInfo: function(req, res, next){
            Api.create(req.body, function(err, result){
                if (err){
                    next();
                }else{
                    res.send(result);
                }
            });
        },

        updateApiInfo: function(req, res, next){
            Api.update(req.body, function(err, result){
                if (err){
                    next(err);
                }else{
                    res.send(result);
                }
            });
        },
};
