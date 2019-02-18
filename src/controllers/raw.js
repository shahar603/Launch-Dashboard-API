const Launch = require("../models/launch");
const getTelemetry = require("../helpers/telemetry_helper");





module.exports = {
    // Get the raw telemetry from a specific launch
    getOne: async (req, res, next) => {
        try{
            let out = await getTelemetry("raw", req.identifiers, req.modifiers);
            res.send(out);
        }catch(err){
            next(err, req, res, next);
        }

    }


};
