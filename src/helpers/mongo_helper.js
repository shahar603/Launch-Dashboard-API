const Launch = require("../models/launch");



async function writeLaunchToDb(launch){
    return await Launch.create(launch);
}

async function getLaunchFromDb(key){
    return await Launch.findOne(key);
}

async function updateLaunchInDb(key, launch){
    return await Launch.findOneAndUpdate(key, launch);
}

async function deleteLaunchFromDb(key){
    return await Launch.findOneAndDelete(key);
}



module.exports = {
    findLaunchMetadata: async function(identifiers){
        return await getLaunchFromDb(identifiers);
    },


    addLaunchMetadata: async function(launch){
        return writeLaunchToDb(launch);
    },


    updateLaunchMetadata: async function(identifiers, launch, rawPath, analysedPath, eventsPath){
        return updateLaunchInDb(identifiers, launch);
    },


    deleteLaunchMetadata: async function(identifiers){
        return await deleteLaunchFromDb(identifiers);
    }

};
