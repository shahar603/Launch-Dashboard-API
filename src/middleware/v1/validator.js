const _ = require("lodash");

module.exports = {

    checkIdentifiers: function(req, res, next){
        if (_.isEmpty(req.identifiers)){
            throw new Error("Missing \"flight_number\", \"mission_id\" or \"launch_library_id\"");
        }
        next();
    }
};
