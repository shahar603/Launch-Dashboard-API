// Import model to interact with the database
const Launch = require("../models/launch");
// Import util functions
const _ = require("lodash");
// middleware
const requestSplitter = require("../middleware/request_splitting");




module.exports = {

    // Get information about launches from the database
    info: function getInfo(req, res, next){
            // Get all launches
        if (_.isEmpty(req.identifiers)){
            Launch.
            scan().
            loadAll().
            attributes(["mission_id", "name", "flight_number"]).
            exec(function(err, result){
                    try{
                        if (err || !result)
                            throw {status: 404, message: "Not Found"};

                        result = result.Items.map((model) => model.attrs);
                        res.send(result.sort((elm1, elm2) => elm1.flight_number - elm2.flight_number));
                    }catch(err){
                        next(err);
                    }
                });
        }
        // Get a specific launch
        else{
            Launch.get(req.identifiers, { ProjectionExpression : "mission_id, name, flight_number" }).
                 then(function(err, result) {
                    if (!result)
                        throw {status: 404, message: "Not Found"};

                    result = result.attrs;
                    res.send(result);
                });
        }
    },


    // Get all the available data about a specific launch
    getOne: async function(req, res, next){
        let result = await global.REDIS_CLIENT.get(`launches:${JSON.stringify(req.identifiers)}`);

        if (result){
            res.type("json").send(result);
        }else{
            result = Launch.get(req.identifiers).
                then(function(result){
                    if (!result)
                        throw {status: 404, message: "Not Found"};

                    result = result.attrs;

                    global.REDIS_CLIENT.set(`launches:${JSON.stringify(req.identifiers)}`, JSON.stringify(result));
                    global.REDIS_CLIENT.expire(`launches:${JSON.stringify(req.identifiers)}`, 60);

                    res.send(result);
                }).catch(next);
            }
    },


    // Add a launch to the database
    addOne: function(req, res, next){
        Launch.create(req.body).then(function(result){
            if (!result){
                next();
            }else{
                res.send(result);
            }
        }).catch(next);
    },



    updateOne: function(req, res, next){
        Launch.update(req.body).then(function(result){
                if (!result){
                    next();
                }else{
                    global.REDIS_CLIENT.del(`launches:${JSON.stringify(req.identifiers)}`);
                    global.REDIS_CLIENT.del(`raw:${JSON.stringify(req.identifiers)}`);
                    global.REDIS_CLIENT.del(`analysed:${JSON.stringify(req.identifiers)}`);

                    res.send(result);
                }
            }).catch(next);
    },


    deleteOne: function(req, res, next){
        if (_.isEmpty(req.identifiers)){
            throw new Error("Missing \"flight_number\" and \"mission_id\"");
        }

        Launch.destroy(req.identifiers).then(function(err){
            if (err){
                next();
            }else{
                global.REDIS_CLIENT.del(`launches:${JSON.stringify(req.identifiers)}`);
                global.REDIS_CLIENT.del(`raw:${JSON.stringify(req.identifiers)}`);
                global.REDIS_CLIENT.del(`analysed:${JSON.stringify(req.identifiers)}`);
                res.send({message: "Deleted item successfully"});
            }
        }).catch(next);
    },



};
