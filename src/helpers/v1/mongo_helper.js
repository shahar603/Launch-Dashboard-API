const Company = require("../../models/v1/company");

module.exports = {
    findLaunchMetadata: async function(company_id, identifiers){
        
        function launchExists(identifiers, launch){
            let match = true;
            
            for(let key in identifiers){
                match = match && (identifiers[key] === launch[key]);
            }

            return match;
        }
        

        let launches = await Company.findOne({company_id: company_id}, "launches");

        for(let i = 0; i < launches.launches.length; i++){
            if (launchExists(identifiers, launches.launches[i])){
                return launches.launches[i];
            }
        }
    
        return undefined;
    },


    addLaunchMetadata: async function(company_id, launch){
        return await Company.findOneAndUpdate({company_id: company_id}, {$push: {launches: launch}});
    },


    updateLaunchMetadata: async function(company_id, identifiers, launch){
        return await Company.findOneAndUpdate({company_id: company_id, launches: identifiers}, {$set: {launches: launch}});
    },


    deleteLaunchMetadata: async function(company_id, identifiers){
        return await Company.findOneAndUpdate({company_id: company_id}, {$pull: {launches: identifiers}});
    },

    findLaunch: function findLaunch(identifiers, launch){
        let match = true;

        Object.keys(identifiers).forEach(function(key) {
            if (identifiers[key] != launch[key])
                match = false;
        });

        return match;
    }

};
