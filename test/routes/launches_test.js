// Import assert to unit test the database
const assert = require("assert");
const controller = require("../../src/controllers/launches");


// Create a series of tests
describe("Testing the /launches endpoint is returning the correct data", function(){


    // Make sure the info returns only metadata fields
    it("launches/info with empty res returns all the launches without the telemetry", function(done){
        let req = {};

        let res = {
            send: function(launches) {
                for(let i = 0; i < launches.length; i++){
                    Object.keys(launches[i].toJSON()).forEach((val) => assert(["_id", "name", "mission_id", "flight_number"].includes(val)));
                }

                for(let i = 0; i < launches.length - 1; i++){
                    assert(launches[i].toJSON().flight_number < launches[i+1].toJSON().flight_number);
                }

                assert(launches[0].mission_id === "orbcomm-og2-m2");
                assert(launches[0].name === "Orbcomm OG2");
                assert(launches[0].flight_number === 25);
                done();
            },
            next: function(err){
                assert(false);
                done();
            }
        };

        controller.info(req, res, null);
    });



    it("launches/info with a valid flight_number returns a single launch with telemetry", function(done){
        let req = {
            identifiers: {
                flight_number: 25
            }
        };

        let res = {
            send: function(res) {
                let launch = res.toJSON();
                let objKeys = ["_id", "name", "mission_id", "flight_number"];
                Object.keys(launch).forEach((val) => assert(objKeys.includes(val)));
                assert(objKeys.length === Object.keys(launch).length);
                assert(launch.mission_id === "orbcomm-og2-m2");
                assert(launch.name === "Orbcomm OG2");
                assert(launch.flight_number === 25);
                done();
            },
            next: function(err){
                assert(false);
                done();
            }
        };

        controller.info(req, res, null);
    });




    it("launches/info with an invalid flight_number shoud returns a 404 not found error", function(done){
        let req = {
            identifiers: {
                flight_number: 123456
            }
        };

        let res = {
            send: function(res) {
                assert(false);
                done();
            }
        };


        controller.info(req, res, function(err){
            assert(err.status === 404);
            done();
        });
    });



    it("launches/info with a valid mission_id returns a single launch with telemetry", function(done){
        let req = {
            identifiers: {
                mission_id: "orbcomm-og2-m2"
            }
        };

        let res = {
            send: function(res) {
                let launch = res.toJSON();
                let objKeys = ["_id", "name", "mission_id", "flight_number"];
                Object.keys(launch).forEach((val) => assert(objKeys.includes(val)));
                assert(objKeys.length === Object.keys(launch).length);
                assert(launch.mission_id === "orbcomm-og2-m2");
                assert(launch.name === "Orbcomm OG2");
                assert(launch.flight_number === 25);
                done();
            },
            next: function(err){
                assert(false);
                done();
            }
        };

        controller.info(req, res, null);
    });






    it("launches/info with contradicting mission_id and flight_number returns a 404 error", function(done){
        let req = {
            identifiers: {
                mission_id: "orbcomm-og2-m2",
                flight_number: 123
            }
        };

        let res = {
            send: function(res) {
                assert(false);
                done();
            },
            next: function(err){
                assert(false);
                done();
            }
        };

        controller.info(req, res, function(err){
            assert(err.status === 404);
            done();
        });
    });
});
