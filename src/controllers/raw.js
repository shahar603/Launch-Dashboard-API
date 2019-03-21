const Launch = require("../models/launch");
const {getTelemetry} = require("../helpers/telemetry_helper");





module.exports = {
    // Get the raw telemetry from a specific launch
    getOne: async (req, res, next) => {
        try{
            if (!req.modifiers) {
                let result = await global.REDIS_CLIENT.get(`raw:${JSON.stringify(req.identifiers)}`);

                if (result){
                    res.type("json").send(result);
                }
            }

            let out = await getTelemetry("raw", req.identifiers, req.modifiers);

            if (req.modifiers === {}){
                global.REDIS_CLIENT.set(`raw:${JSON.stringify(req.identifiers)}`, JSON.stringify(out));
                global.REDIS_CLIENT.expire(`raw:${JSON.stringify(req.identifiers)}`, 60);
            }

            res.send(out);
        }catch(err){
            next(err, req, res, next);
        }

    }


};
