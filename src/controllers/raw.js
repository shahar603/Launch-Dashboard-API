const {getTelemetry} = require("../helpers/telemetry_helper");
const cacheHelper = require("../helpers/cache_helper");




module.exports = {
    // Get the raw telemetry from a specific launch
    getOne: async (req, res, next) => {
        const cacheKey = `raw:${JSON.stringify(req.identifiers)}`;

        try{
            if (!req.modifiers) {
                let result = await cacheHelper.get(cacheKey);

                if (result){
                    res.type("json").send(result);
                }
            }

            let out = await getTelemetry("raw", req.identifiers, req.modifiers);

            if (req.modifiers === {}){
                cacheHelper.add(cacheKey, JSON.stringify(out), 60);
            }

            res.send(out);
        }catch(err){
            next(err, req, res, next);
        }

    }


};
