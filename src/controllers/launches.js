// Import model to interact with the database
const Launch = require("../models/launch");
// Import util functions
const _ = require("lodash");
//
const requestSplitter = require("../middleware/middleware");



module.exports = {

    // Get all the available data about a specific launch
    getOne: function(req, res, next){
        Launch.find(req.identifiers).
        then(function(result){
            res.send(result);
        }).
        catch(next);
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
        requestSplitter(req, null, () => {});

        Launch.findOneAndUpdate(req.identifiers, req.body).
            then(function(result){
                res.send(result);
            }).
            catch(next);
    },


    deleteOne: function(req, res, next){
        requestSplitter(req, null, () => {});

        Launch.findOneAndDelete(req.identifiers).
            then(function(result){
                res.send(result);
            }).
            catch(next);
    },



    // Get information about launches from the database
    info: function(req, res, next){
        // Get all launches
        if (_.isEmpty(req.identifiers)){
            Launch.find({}, "mission_id name flight_number").
                then(function(result){
                    res.send(result);
                }).
                catch(next);
        }
        // Get a specific launches
        else{
            Launch.findOne(req.identifiers, "mission_id name flight_number").
                then(function(result){
                    res.send(result);
                }).
                catch(next);
        }
    }




};
