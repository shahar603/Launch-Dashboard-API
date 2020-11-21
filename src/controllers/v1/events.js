const _ = require("lodash");
const mongoHelper = require("../../helpers/v1/mongo_helper");
const s3Helper = require("../../helpers/v1/s3_helper");



module.exports = {
    // Get the events of a specific launch
    getOne: async function(req, res, next){
        try{
            // Get the launch from the database
            let launchMetadata = await mongoHelper.findLaunchMetadata(req.params.company, req.identifiers);

            if (!launchMetadata){
                throw {status: 404, message: "Not Found"};
            }

            res.send(await s3Helper.getFile(launchMetadata.events_path));
        }catch(err){
            next(err, req, res, next);
        }
    }


};
