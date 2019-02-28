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

                    res.send(result);
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
        //let result = await global.REDIS_CLIENT.getAsync(`launches:${JSON.stringify(req.identifiers)}`);

        let result = null;

        if (result){
            res.type("json").send(result);
        }else{
            Launch.findOne(req.identifiers).
                then(async function(result){
                    if (!result)
                        throw {status: 404, message: "Not Found"};

                    await global.REDIS_CLIENT.setexAsync(`launches:${JSON.stringify(req.identifiers)}`, 60, JSON.stringify(result));

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
                res.send(result);
            }).
            catch(next);
    },



};
