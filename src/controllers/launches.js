const Launch = require("../models/launch");
const _ = require("lodash");


module.exports = {

    // Get information about launches from the database
    launches: function(req, res, next){
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
    },


    // Add a launch to the database
    add: function(req, res, next){
        Launch.create(req.params).
            then(function(result){
                console.log(result);
            }).
            catch(next);
    }


};
