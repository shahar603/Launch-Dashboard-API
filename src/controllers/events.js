const Launch = require("../models/launch");

module.exports = {
    // Get the events of a specific launch
    getOne: async function(req, res, next){
        try{
            // TODO change to 'get events' function
            let data = await Launch.findOne(req.identifiers, "events");

            if (!data){
                throw {status: 404, message: "Not Found"};
            }

            res.send(data);
        }catch(err){
            next(err, req, res, next);
        }
    }


};
