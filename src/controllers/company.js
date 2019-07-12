const Company = require("../models/company");



module.exports = {
    getOne: async function(req, res, next){
        res.send(await Company.findOne({company_id: req.params.company}, "company_id name"));
    },


    addOne: async function(req, res, next){
        try{
            let result = await Company.create(req.body);

            if (!result){
                throw {status: 500, message: "Failed to create company"};
            }

            res.send(result);
        }catch(ex){
            next(ex);
        }
    },


    updateOne: async function(req, res, next){
        try{
            let result = await Company.findOneAndUpdate(req.body);

            if (!result){
                throw {status: 500, message: "Failed to update company"};
            }

            res.send(result);
        }catch(ex){
            next(ex);
        }
    },

    deleteOne: async function(req, res, next){
        res.send(await Company.findOneAndDelete({company_id: req.params.company}));
    }
}
