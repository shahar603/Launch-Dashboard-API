const {getTelemetry} = require("../../helpers/v2/telemetry_helper");
const cacheHelper = require("../../helpers/cache_helper");


module.exports = {
    // Get the analysed telemetry from a specific launch
    getOne: async function(req, res, next){
        const cacheKey = `analysed:${JSON.stringify(req.identifiers)}`;

        try{
            if (!req.modifiers) {
                let result = await cacheHelper.get(cacheKey);

                if (result){
                    res.type("json").send(result);
                    return;
                }
            }
            
            let out = await getTelemetry("analysed", req.params.company, req.identifiers, req.modifiers);

            if (!out)
                throw new Error("Telemetry data is unavailable (even thought it should be)\nPlease report this issue on the Launch Dashboard API GitHub Repository");

            if (req.modifiers === {}){
                cacheHelper.add(cacheKey, JSON.stringify(out), 60);
            }

            res.send(out);
        }catch(err){
            next(err, req, res, next);
        }
    }


};
