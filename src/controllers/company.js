const Company = require("../models/company");
const Joi = require("joi");

async function getCompany(company_id){
    return await Company.findOne({company_id: company_id}, "-_id company_id name lsp");
}

module.exports = {
    exists: async function(company_id){
        return await getCompany(company_id) != null;
    },


    getAll: async function(req, res, next){

        if(req.query.lsp){
            try{
                // Returned the parsed lsp value. Throws a validation exception if given lsp value isn't a positive integer
                const lsp = await Joi.validate(req.query.lsp, Joi.number().positive().integer());

                const result = await Company.findOne({lsp: lsp}, "-_id company_id name lsp");

                if (result)
                    res.send(result);
                else
                    throw {status: 404, message: `Company with lsp="${lsp}" does not exist`};
            }catch(ex){
                next(ex);
            }
        }
        else{
            res.send(await Company.find({}, "-_id company_id name lsp"));
        }
    },

    getOne: async function(req, res, next){
        try{
            const result = getCompany(req.params.company);
            
            if (!result)
                throw {status: 404, message: `Company "${req.params.company}" does not exist`};
            
            res.send(result);
        }catch(ex){
            next(ex);
        }
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
        }    },

    deleteOne: async function(req, res, next){
        res.send(await Company.findOneAndDelete({company_id: req.params.company}));
    }
}
