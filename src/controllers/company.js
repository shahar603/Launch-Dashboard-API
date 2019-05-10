const Company = require("../models/company");



module.exports = {
    getOneCompany: async function(req, res, next){
        res.send(await Company.findOne({company_id: req.params.company}, "company_id name"));
    },


    addOneCompany: async function(req, res, next){
        try{
            res.send(await Company.create(req.body));
        }catch(ex){
            next(ex);
        }
    },


    updateOneCompany: async function(req, res, next){
        res.send(await Company.findOneAndUpdate(req.body));
    },

    deleteOneCompany: async function(req, res, next){
        res.send(await Company.findOneAndDelete({company_id: req.params.company}));
    }
}
