// Require the utilities function
const _ = require("lodash");
const Joi = require("joi");





// name of url paramters used to identify keys from the database
let identifierKeys = Joi.object({
    "mission_id": Joi.string(),
    "flight_number": Joi.number().integer().positive()
}).options({ stripUnknown: true });


// name of url paramters used to modify lookup
let modifierKeys = Joi.object({
    "event": Joi.string(),
    "start": Joi.alternatives().try(Joi.string(), Joi.number()),
    "end": Joi.alternatives().try(Joi.string(), Joi.number()),
    "stage": Joi.number().integer().positive(),
    "start_offset": Joi.number(),
    "end_offset": Joi.number(),
    "event_offset": Joi.number()
}).options({ stripUnknown: true });





async function validate(req){
    req.identifiers = await Joi.validate(req.query, identifierKeys);
    req.modifiers = await Joi.validate(req.query, modifierKeys);
    return req;
}



// Split the query parameters to two objects
// identifiers: keys used to find data in the database
// modifiers: keys used to filter the data
function requestSplitter(req, res, next){
    validate(req).then(() => {
        next();
    }).catch((err) => {
        if (res !== undefined &&
             res !== null &&
             res.status !== undefined &&
             res.send !== undefined){
            res.
            status(400).
            send({ error: err.details[0].message });
        }
    });
}


// Export the function
module.exports = requestSplitter;
