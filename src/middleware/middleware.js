// Require the utilities function
const _ = require("lodash");

// name of url paramters used to identify keys from the database
let identifiersKeys = ["mission_id", "flight_number"];


// Split the query parameters to two objects
// identifiers: keys used to find data in the database
// modifiers: keys used to filter the data
function requestSplitter(req, res, next){
    let keys;

    req.identifiers = _.pick(req.query, identifiersKeys);
    keys = _.difference(Object.keys(req.query), Object.keys(req.identifiers));
    req.modifyers = _.pick(req.query, keys);
    next();
}


// Export the function
module.exports = requestSplitter;
