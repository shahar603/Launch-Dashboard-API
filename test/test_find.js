// Import bluebird for promises
const Promise = require("bluebird");
// Import mocha and assert to unit test the database
const mocha = require("mocha");
const assert = require("assert");
// Import the MarioChar model
const Launch = Promise.promisifyAll(require("../models/launch"));




// Create a series of tests
describe("Finding record", function(){

    // Add a record to the database
    beforeEach(function(done){
        let launch1 = new Launch({
                id: "crs-12",
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
        });

        launch1.save().then(function(){
            done();
        });
    });


    // Find one record from the database using the id
    it("Finds one record from the database by id", function(done){
        Launch.findOne({ id: "crs-12" }).then(function(result){
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




    // Finds one record from the database by flight number and id
    it("Finds one record from the database by flight number and id", function(done){
        Launch.findOne({ id: "crs-12", flight_number: 1337 }).then(function(result){
            assert(result.name === "SpaceX CRS-12");
            done();
        });
    });



    // Give incorrect id and correct flight number
    it("Find nothing due to incorrect id and correct flight number", function(done){
        Launch.findOne({ id: "Hello", flight_number: 1337 }).then(function(result){
            assert(result === null);
            done();
        });
    });



    // Give correct id and incorrect flight number
    it("Find nothing due to correct id and incorrect flight number", function(done){
        Launch.findOne({ id: "crs-12", flight_number: 11111 }).then(function(result){
            assert(result === null);
            done();
        });
    });



    // Mongo check if flight_number is undefined
    it("Find nothing due to correct id but undefined flight_number", function(done){
        Launch.findOne({ id: "crs-12", flight_number: undefined }).then(function(result){
            assert(result === null);
            done();
        });
    });



    // Add additional keys that are not in the database and find nothing
    it("Add additional keys that are not in the database and find nothing", function(done){
        Launch.findOne({ id: "crs-12", start: 1234 }).then(function(result){
            assert(result === null);
            done();
        });
    });



    // Test case sensitivity of strings in mongo
    it("Is mongo case sensetive?", function(done){
        Launch.findOne({ id: "CRS-12", flight_number: 11111 }).then(function(result){
            assert(result === null);
            done();
        });
    });




});
