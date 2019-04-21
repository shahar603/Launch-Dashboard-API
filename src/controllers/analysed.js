const {getTelemetry} = require("../helpers/telemetry_helper");


module.exports = {
    // Get the analysed telemetry from a specific launch
    getOne: async function(req, res, next){
        try{

            if (!req.modifiers) {
                let result = null; //await global.REDIS_CLIENT.get(`analysed:${JSON.stringify(req.identifiers)}`);

                if (result){
                    res.type("json").send(result);
                }
            }
            
            let out = await getTelemetry("analysed", req.identifiers, req.modifiers);


            if (req.modifiers === {}){
                //global.REDIS_CLIENT.set(`analysed:${JSON.stringify(req.identifiers)}`, JSON.stringify(out));
                //global.REDIS_CLIENT.expire(`analysed:${JSON.stringify(req.identifiers)}`, 60);

            }

            res.send(out);
        }catch(err){
            next(err, req, res, next);
        }
    }


};
