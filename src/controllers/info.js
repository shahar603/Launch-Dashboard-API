



module.exports = {
        api: function(req, res, next){
            res.send("JSON API information");
        },


        info: function(req, res, next){
            res.send("Readable API information");
        }
};
