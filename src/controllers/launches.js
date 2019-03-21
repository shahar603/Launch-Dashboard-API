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
            Launch.find({}, "mission_id name flight_number").
                then(function(result){
                    if (!result)
                        throw {status: 404, message: "Not Found"};

                    res.send(result.sort((elm1, elm2) => elm1.flight_number - elm2.flight_number));
                }).
                catch(next);
        }
        // Get a specific launch
        else{
            Launch.findOne(req.identifiers, "mission_id name flight_number").
                then(function(result){
                    if (!result)
                        throw {status: 404, message: "Not Found"};

                    res.send(result);
                }).
                catch(next);
        }
    },


    // Get all the available data about a specific launch
    getOne: async function(req, res, next){
        let result = null; //await global.REDIS_CLIENT.get(`launches:${JSON.stringify(req.identifiers)}`);

        if (result){
            res.type("json").send(result);
        }else{
            Launch.findOne(req.identifiers).
                then(async function(result){
                    if (!result)
                        throw {status: 404, message: "Not Found"};

                    //global.REDIS_CLIENT.set(`launches:${JSON.stringify(req.identifiers)}`, JSON.stringify(result));
                    //global.REDIS_CLIENT.expire(`launches:${JSON.stringify(req.identifiers)}`, 60);

                    res.send(result);
                }).
                catch(next);
        }
    },


    // Add a launch to the database
    addOne: function(req, res, next){
        Launch.create(req.body).
            then(function(result){
                res.send(result);
            }).
            catch(next);
    },



    updateOne: function(req, res, next){
        Launch.findOneAndUpdate(req.identifiers, req.body).
            then(function(result){
                //global.REDIS_CLIENT.del(`launches:${JSON.stringify(req.identifiers)}`);
                //global.REDIS_CLIENT.del(`raw:${JSON.stringify(req.identifiers)}`);
                //global.REDIS_CLIENT.del(`analysed:${JSON.stringify(req.identifiers)}`);

                res.send(result);
            }).
            catch(next);
    },


    deleteOne: function(req, res, next){
        if (_.isEmpty(req.identifiers)){
            throw new Error("Missing \"flight_number\" and \"mission_id\"");
        }

        Launch.findOneAndDelete(req.identifiers).
            then(function(result){
                //global.REDIS_CLIENT.del(`launches:${JSON.stringify(req.identifiers)}`);
                //global.REDIS_CLIENT.del(`raw:${JSON.stringify(req.identifiers)}`);
                //global.REDIS_CLIENT.del(`analysed:${JSON.stringify(req.identifiers)}`);
                res.send(result);
            }).
            catch(next);
    },



};
