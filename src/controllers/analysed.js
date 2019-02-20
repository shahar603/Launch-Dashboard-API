const getTelemetry = require("../helpers/telemetry_helper");


module.exports = {
    // Get the analysed telemetry from a specific launch
    getOne: async function(req, res, next){
        try{
            let out = await getTelemetry("analysed", req.identifiers, req.modifiers);
            res.send(out);
        }catch(err){
            next(err, req, res, next);
        }
    }


};
