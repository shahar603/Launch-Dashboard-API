const _ = require("lodash");


module.exports = {

    checkIdentifiers: function(req, res, next){
        if (_.isEmpty(req.identifiers)){
            throw new Error("Missing \"flight_number\" or \"mission_id\"");
        }
        next();
    }
};
