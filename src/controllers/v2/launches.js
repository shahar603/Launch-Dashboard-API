const Company = require("../../models/v2/company");
const s3Helper = require("../../helpers/v2/s3_helper");
const mongoHelper = require("../../helpers/v2/mongo_helper");
const _ = require("lodash");
const { checkIdentifiers } = require("../../middleware/v2/validator");
const company = require("./company");
const {modifyData} = require("../../helpers/v2/telemetry_helper");

async function exists(company_id, identifiers){
    return await mongoHelper.findLaunchMetadata(company_id, identifiers) != null;
}

function findLaunch(companies, launch_library_2_id){
    for(let company of companies){
        for(let launch of company.launches) {
            if(launch_library_2_id === launch.launch_library_2_id){
                return {company: company, launch: launch};
            }
        }
    }

    return {company: null, launch: null};
}

module.exports = {
    // Get information about launches from the database
    info: async function getInfo(req, res, next){
        try{
        // Get all launches
        if (_.isEmpty(req.identifiers)){
            let result = await Company.findOne({company_id: req.params.company}, "launches.mission_id launches.name launches.flight_number launches.launch_library_2_id");

            if (!result)
                throw {status: 404, message: "Not Found"};

            res.send(result.launches.sort((elm1, elm2) => elm1.flight_number - elm2.flight_number));
        }
        // Get a specific launch
        else{
            let result = await mongoHelper.findLaunchMetadata(req.params.company, req.identifiers);
            
            if (!result)
                throw {status: 404, message: "Not Found"};

            res.send({
                mission_id: result.mission_id,
                name: result.name,
                flight_number: result.flight_number,
                launch_library_2_id: result.launch_library_2_id
            });
        }
        }catch(ex){
        next(ex);
        }
    },




    getLaunchFromLaunchLibraryProvider: async function(req, res, next){
        try{
            if(!req.identifiers.launch_library_2_id){
                throw new Error("Missing \"launch_library_2_id\" or \"ccompany\" parameters");
            }

            const companies = await Company.find({});
            const {company, launch} = findLaunch(companies, req.identifiers.launch_library_2_id);

            if (!launch){
                next({status: 404, message: `Launch with launch_library_2_id: ${req.identifiers.launch_library_2_id} doesn't exists`}); 
                return;
            }

            let result = await mongoHelper.findLaunchMetadata(company.company_id, {launch_library_2_id: launch.launch_library_2_id});

            // If no launch was found return a "Not Found" error
            if (!result){
                next({status: 404, message: "Not Found"});
                return;
            }
    
            // Get the telemetry
            let { rawData, analysedData, eventData } = await s3Helper.getOneLaunch(result);

            if (!rawData || !analysedData || !eventData)
                throw new Error("Telemetry data is unavailable (even thought it should be)\nPlease report this issue on the Launch Dashboard API GitHub Repository");

            const {raw, analysed} = modifyData(rawData, analysedData, eventData, req.modifiers);

            // box the metadata and telemetry and send it
            res.send(
                {
                    mission_id: result.mission_id,
                    name: result.name,
                    flight_number: result.flight_number,
                    launch_library_2_id: result.launch_library_2_id,
                    raw: raw,
                    analysed: analysed,
                    events: eventData
                }
            );
        }catch(ex){
            next(ex);
        }
    },


    // Get all the available data about a specific launch
    getLaunches: async function(req, res, next){
        if(!await company.exists(req.params.company)){
            next({status: 404, message: `Company "${req.params.company}" is not found`});
            return;
        }

        // Get all launches
        if (_.isEmpty(req.identifiers)){
            try{
                let result = await Company.findOne({company_id: req.params.company}, "launches.mission_id launches.name launches.flight_number launches.launch_library_2_id");

                if (!result)
                    throw {status: 404, message: "Not Found`"};
    
                res.send(result.launches.sort((elm1, elm2) => elm1.flight_number - elm2.flight_number));
            }catch(ex){
                next(ex);
            }

        }else if (checkIdentifiers(req, res, async () => {
            try{
                let result = await mongoHelper.findLaunchMetadata(req.params.company, req.identifiers);

                // If no launch was found return a "Not Found" error
                if (!result){
                    next({status: 404, message: "Not Found"});
                    return;
                }
        
                // Get the telemetry
                let { rawData, analysedData, eventData } = await s3Helper.getOneLaunch(result);

                if (!rawData || !analysedData || !eventData)
                    throw new Error("Telemetry data is unavailable (even thought it should be)\nPlease report this issue on the Launch Dashboard API GitHub Repository");

                const {raw, analysed} = modifyData(rawData, analysedData, eventData, req.modifiers);

                // box the metadata and telemetry and send it
                res.send(
                    {
                        mission_id: result.mission_id,
                        name: result.name,
                        flight_number: result.flight_number,
                        launch_library_2_id: result.launch_library_2_id,
                        raw: raw,
                        analysed: analysed,
                        events: eventData
                    }
                );
            }catch(ex){
                next(ex);
            }
        }));
    },


    getLatestLaunch: async function(req, res, next){
       if(!await company.exists(req.params.company)){
            next({status: 404, message: `Company "${req.params.company}" is not found`});
            return;
       }

    
        try{
            const flight_numbers = await Company.findOne({company_id: req.params.company}, "launches.flight_number");
               
            if (flight_numbers.length === 0)
                throw new Error(`No launches found for ${req.params.company}`);
               

            // Inefficent but easy in JS
            const launches = flight_numbers.launches.sort((elm1, elm2) => elm1.flight_number - elm2.flight_number);
            const result = await mongoHelper.findLaunchMetadata(req.params.company, {flight_number: launches[launches.length-1].flight_number});
                
            // If no launch was found return a "Not Found" error
            if (!result){
                next({status: 404, message: "Not Found"});
                return;
            }
            
            // Get the telemetry
            let { rawData, analysedData, eventData } = await s3Helper.getOneLaunch(result);

            if (!rawData || !analysedData || !eventData)
                    throw new Error("Telemetry data is unavailable (even thought it should be)\nPlease report this issue on the Launch Dashboard API GitHub Repository");
    
            const {raw, analysed} = modifyData(rawData, analysedData, eventData, req.modifiers);

            // box the metadata and telemetry and send it
            res.send(
                {
                    mission_id: result.mission_id,
                    name: result.name,
                    flight_number: result.flight_number,
                    launch_library_2_id: result.launch_library_2_id,
                    raw: raw,
                    analysed: analysed,
                    events: eventData
                }
            );
        }catch(ex){
            next(ex);
        }  
    },


    // Add a launch to the database
    addOne: async function(req, res, next){
        try{
            // If the company doesn't exist or if the launch already exists throw an error
            if(!await company.exists(req.body.company_id))
                throw new Error(`Company "${req.body.company_id}" doesn't exists`);

            if (await exists(req.body.company_id, {flight_number: req.body.flight_number}))
                throw new Error(`Launch "${req.body.mission_id}" already exists`);


            // Put the telemetry in storage
            let launchMetadata = await s3Helper.addOneLaunch(req.body);

            // Put the metadata in the database
            res.send(
                mongoHelper.addLaunchMetadata(req.body.company_id, launchMetadata)
            );
        }catch(e){
            next(e);
        }
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
            throw new Error("Missing \"flight_number\", \"mission_id\" or \"launch_library_2_id\"");
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

        await s3Helper.deleteOneLaunch(launch);

        res.send(launch);
    },



};
