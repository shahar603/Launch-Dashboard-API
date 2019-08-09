const Company = require("../models/company");
const s3Helper = require("../helpers/s3_helper");
const mongoHelper = require("../helpers/mongo_helper");
const _ = require("lodash");
const { checkIdentifiers } = require("../middleware/validator");







module.exports = {

    // Get information about launches from the database
    info: async function getInfo(req, res, next){
        try{
        // Get all launches
        if (_.isEmpty(req.identifiers)){
            let result = await Company.findOne({company_id: req.params.company}, "launches.mission_id launches.name launches.flight_number");

            if (!result)
                throw {status: 404, message: "Not Found"};

            res.send(result.launches.sort((elm1, elm2) => elm1.flight_number - elm2.flight_number));
        }
        // Get a specific launch
        else{
            let result = await mongoHelper.findLaunchMetadata(req.params.company, req.identifiers);
            
            if (!result)
                throw {status: 404, message: "Not Found"};

            res.send(result);
        }
        }catch(ex){
        next(ex);
        }
    },


    // Provide help for the users with informative errors
    getError: async function(req, res, next){
        next({status: 422, message: "Missing `company` parameter"});
    },



    // Get all the available data about a specific launch
    getLaunches: async function(req, res, next){
        // Get all launches
        if (_.isEmpty(req.identifiers)){
            try{
                let result = await Company.findOne({company_id: req.params.company}, "launches.mission_id launches.name launches.flight_number");

                if (!result)
                    throw {status: 404, message: "Not Found`"};
    
                res.send(result.launches.sort((elm1, elm2) => elm1.flight_number - elm2.flight_number));
            }catch(ex){
                next(ex);
            }

        }else if (checkIdentifiers(req, res, async () => {
            try{
                console.time("start");
                let result = await mongoHelper.findLaunchMetadata(req.params.company, req.identifiers);
                console.timeEnd("start");

                // If no launch was found return a "Not Found" error
                if (!result){
                    next({status: 404, message: "Not Found"});
                    return;
                }
        
                console.time("end");
                // Get the telemetry
                let { rawData, analysedData, eventData } = await s3Helper.getOneLaunch(result);
                console.timeEnd("end");

                // box the metadata and telemetry and send it
                res.send(
                    {
                        mission_id: result.mission_id,
                        name: result.name,
                        flight_number: result.flight_number,
                        launch_library_id: result.launch_library_id,
                        raw: rawData,
                        analysed: analysedData,
                        events: eventData
                    }
                );
            }catch(ex){
                next(ex);
            }
        }));
    },


    // Add a launch to the database
    addOne: async function(req, res, next){
        // Put the telemetry in storage
        let launchMetadata = await s3Helper.addOneLaunch(req.body);

        // Put the metadata in the database
        res.send(
            mongoHelper.addLaunchMetadata(req.body.company_id, launchMetadata)
        );
    },



    updateOne: async function(req, res, next){
        // Update the telemetry in storage
        let launchMetadata = await s3Helper.updateOneLaunch(req.body);

        if (launchMetadata)
            throw {status: 500, message: "Failed to update launch"};

        // Update the metadata in the database
        res.send(
            await mongoHelper.updateOneLaunch(req.identifiers, launchMetadata)
        );
    },


    deleteOne: async function(req, res, next){
        if (!req.params.company || _.isEmpty(req.identifiers)){
            throw new Error("Missing \"flight_number\" or \"mission_id\"");
        }
        // Get launch file name (key) from db
        let launch = await mongoHelper.findLaunchMetadata(req.params.company, req.identifiers);

        if (!launch){
            next({status: 404, message: "Not Found"});
            return;
        }

        if (!await mongoHelper.deleteLaunchMetadata(req.params.company, req.identifiers)){
            next({status: 500, message: "Failed to delete launch"});
            return;
        }

        let deletedLaunch = await s3Helper.deleteOneLaunch(launch);

        if (!deletedLaunch){
            next({status: 500, message: "Failed to delete launch"});
            return;
        }

        res.send(launch);
    },



};
