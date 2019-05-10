const Company = require("../models/company");
const _ = require("lodash");

module.exports = {
    // Get the events of a specific launch
    getOne: async function(req, res, next){
        try{
            let launches = await Company.findOne(req.params.company, "launches");

            if (!launches){
                throw {status: 404, message: "Not Found"};
            }

            let data = _.some(launches, req.identifiers);

            res.send(data);
        }catch(err){
            next(err, req, res, next);
        }
    }


};
