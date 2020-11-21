module.exports = {

    checkLaunch: function(req, res, next){
        if(!req.body){
            throw new Error("Request body is missing");
        }

        if (!req.body.company_id){
            throw new Error("\"company_id\" is missing");
        }
        next();
    }
};
