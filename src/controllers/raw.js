const Launch = require("../models/launch");

module.exports = {
    // Get the raw telemetry from a specific launch
    getOne: function(req, res, next){
        Launch.find(req.identifiers, "raw").
            then(function(result){
                res.send(result);
            }).
            catch(next);
    }


};
