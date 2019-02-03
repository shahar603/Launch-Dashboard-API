const Launch = require("../models/launch");

module.exports = {
    // Get the analysed telemetry from a specific launch
    getOne: function(req, res, next){
        Launch.find(req.identifiers, "analysed").
            then(function(result){
                res.send(result);
            }).
            catch(next);
    }


};
