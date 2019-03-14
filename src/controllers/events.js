const Launch = require("../models/launch");

module.exports = {
    // Get the events of a specific launch
    getOne: function(req, res, next){
        
        // TODO take only EVENTS
        Launch.get(req.identifiers, function(err, data){
            if (!data){
                throw {status: 404, message: "Not Found"};
            }

            res.send(data);
        });
    }


};
