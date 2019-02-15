// Import bluebird for promises
const Promise = require("bluebird");
// Import assert to unit test the database
const assert = require("assert");
// Import the Launch model
const Launch = Promise.promisifyAll(require("../../src/models/launch"));
// Import lodash for utility functions
const _ = require("lodash");



// Create a series of tests
describe("Finding record", function(){

    /* Don't add any record to the database
    // Add a record to the database
    beforeEach(function(done){

        function addLaunch(data){
            return Launch.create(data);
        }

        addLaunch({
                mission_id: "crs-12",
                name: "SpaceX CRS-12",
                flight_number: 1337,
                raw: [
                    {
                        stage: 0,
                        telemetry: [
                            {time: 0, velocity: 1, altitude: 2},
                            {time: 4, velocity: 5, altitude: 6}
                        ]
                    },
                    {
                        stage: 1,
                        telemetry: [
                            {time: 7, velocity: 8, altitude: 9},
                            {time: 10, velocity: 11, altitude: 12}
                        ]
                    }
                ]
        }).then(function(result){
            assert(result !== null);

            addLaunch({
                mission_id: "crs-13",
                name: "SpaceX CRS-13",
                flight_number: 420,
                raw: [
                    {
                        stage: 0,
                        telemetry: [
                            {time: 0, velocity: 1, altitude: 2},
                            {time: 4, velocity: 5, altitude: 6}
                        ]
                    },
                    {
                        stage: 1,
                        telemetry: [
                            {time: 7, velocity: 8, altitude: 9},
                            {time: 10, velocity: 11, altitude: 12}
                        ]
                    }
                ]
            }).then(function(result){
                assert(result !== null);
                done();
            });
        });



    });
    */


    // Find one record from the database using the mission_id
    it("Finds one record from the database by mission_id", function(done){
        Launch.findOne({ mission_id: "crs-12" }).then(function(result){
            assert(result.name === "SpaceX CRS-12");
            done();
        });
    });




    // Test the flight number property by searching a record using it
    it("Finds one record from the database by flight number", function(done){
        Launch.findOne({ flight_number: 1337 }).then(function(result){
            assert(result.name === "SpaceX CRS-12");
            done();
        });
    });




    // Finds one record from the database by flight number and mission_id
    it("Finds one record from the database by flight number and mission_id", function(done){
        Launch.findOne({ mission_id: "crs-12", flight_number: 1337 }).then(function(result){
            assert(result.name === "SpaceX CRS-12");
            done();
        });
    });



    // Give incorrect mission_id and correct flight number
    it("Find nothing due to incorrect mission_id and correct flight number", function(done){
        Launch.findOne({ mission_id: "Hello", flight_number: 1337 }).then(function(result){
            assert(result === null);
            done();
        });
    });



    // Give correct mission_id and incorrect flight number
    it("Find nothing due to correct mission_id and incorrect flight number", function(done){
        Launch.findOne({ mission_id: "crs-12", flight_number: 11111 }).then(function(result){
            assert(result === null);
            done();
        });
    });



    // Mongo check if flight_number is undefined
    it("Find nothing due to correct mission_id but undefined flight_number", function(done){
        Launch.findOne({ mission_id: "crs-12", flight_number: undefined }).then(function(result){
            assert(result === null);
            done();
        });
    });



    // Add additional keys that are not in the database and find nothing
    it("Add additional keys that are not in the database and find nothing", function(done){
        Launch.findOne({ mission_id: "crs-12", start: 1234 }).then(function(result){
            assert(result === null);
            done();
        });
    });


    // Remove additional keys and find an element
    it("Remove additional keys and find an element", function(done){
        Launch.findOne(_.pick({ mission_id: "crs-12", start: 1234 }, ["mission_id"])).then(function(result){
            assert(result.name === "SpaceX CRS-12");
            done();
        });
    });



    // Test case sensitivity of strings in mongo
    it("Is mongo case sensetive?", function(done){
        Launch.findOne({ mission_id: "CRS-12", flight_number: 11111 }).then(function(result){
            assert(result === null);
            done();
        });
    });





    // Does find returns an array?
    it("Perform find that returns one element and check if it is an array", function(done){
        Launch.find({ mission_id: "crs-12" }).then(function(result){
            assert(Array.isArray(result));
            done();
        });
    });



    // Does find returns an array?
    it("Check whether select perform selection of the elements in the array", function(done){
        Launch.find({}, "mission_id name flight_number").then(function(result){
            let firstResultKeys = Object.keys(result[0].toObject());

            ["_id", "mission_id", "name", "flight_number"].forEach(elm => assert(firstResultKeys.includes(elm)));
            done();
        });
    });



});
