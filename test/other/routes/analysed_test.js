// Import assert to unit test the database
const assert = require("assert");
const controller = require("../../src/controllers/analysed");
const _ = require("lodash");

/*

// Create a series of tests
describe("Testing the /analysed endpoint is returning the correct data", function(){

    it("analysed/ with a valid flight_number", function(done){
        let req = {
            identifiers: {
                flight_number: 25
            },
            modifiers: {}
        };

        let res = {
            send: function(analysed) {
                assert(analysed.length === 1);
                assert(Object.keys(analysed[0]).length === 2);
                assert(analysed[0].stage === 2);
                assert(analysed[0].telemetry !== undefined);
                done();
            },
            next: function(err){
                assert(false);
                done();
            }
        };

        controller.getOne(req, res, function(err){
            assert(false);
            done();
        });
    });




    it("analysed/ with an empty identifiers object throws a 404 error", function(done){
        let req = {
            identifiers: {},
            modifiers: {}
        };

        let res = {
            send: function(analysed) {
                assert(false);
                done();
            },
            next: function(err){
                assert(false);
                done();
            }
        };

        controller.getOne(req, res, function(err){
            assert(err !== undefined);
            assert(err.status === 404);
            done();
        });
    });




    it("analysed/ with conflicting flight_number and mission_id throws a 404 error", function(done){
        let req = {
            identifiers: {
                flight_number: 45,
                mission_id: "not crs-12"
            },
            modifiers: {}
        };

        let res = {
            send: function(analysed) {
                assert(false);
                done();
            },
            next: function(err){
                assert(false);
                done();
            }
        };

        controller.getOne(req, res, function(err){
            assert(err !== undefined);
            assert(err.status === 404);
            done();
        });
    });




    it("analysed/ with a valid flight_number, start and end numeric values", function(done){
        let req = {
            identifiers: {
                flight_number: 45
            },
            modifiers: {
                start: 60,
                end: 70,
            }
        };

        let res = {
            send: function(analysed) {
                assert(analysed.length === 1);
                assert(Object.keys(analysed[0]).length === 2);
                assert(analysed[0].stage === 1);
                assert(analysed[0].telemetry !== undefined);
                analysed[0].telemetry.forEach((val) => {
                    assert(val.time >= 60);
                    assert(val.time <= 70);
                });
                done();
            },
            next: function(err){
                assert(false);
                done();
            }
        };

        controller.getOne(req, res, function(err){
            assert(false);
            done();
        });
    });




    it("analysed/ with a valid flight_number, start and end numeric values but start is negative", function(done){
        let req = {
            identifiers: {
                flight_number: 45
            },
            modifiers: {
                start: -5,
                end: 70,
            }
        };

        let res = {
            send: function(analysed) {
                assert(analysed.length === 1);
                assert(Object.keys(analysed[0]).length === 2);
                assert(analysed[0].stage === 1);
                assert(analysed[0].telemetry !== undefined);
                analysed[0].telemetry.forEach((val) => {
                    assert(val.time >= -5);
                    assert(val.time <= 70);
                });
                done();
            },
            next: function(err){
                assert(false);
                done();
            }
        };

        controller.getOne(req, res, function(err){
            assert(false);
            done();
        });
    });




    it("analysed/ with a valid flight_number but start and end are bigger than the end of the telemetry", function(done){
        let req = {
            identifiers: {
                flight_number: 45
            },
            modifiers: {
                start: 100000,
                end: 1000000,
            }
        };

        let res = {
            send: function(analysed) {
                assert(analysed.length === 1);
                assert(Object.keys(analysed[0]).length === 2);
                assert(analysed[0].stage === 1);
                assert(analysed[0].telemetry !== undefined);
                analysed.forEach((val) => assert(val.telemetry.length === 0));
                done();
            },
            next: function(err){
                assert(false);
                done();
            }
        };

        controller.getOne(req, res, function(err){
            assert(false);
            done();
        });
    });




    it("analysed/ with a valid flight_number, start and end are events", function(done){
        let req = {
            identifiers: {
                flight_number: 45
            },
            modifiers: {
                start: "boostback_start",
                end: "boostback_end",
            }
        };

        let res = {
            send: function(analysed) {
                assert(analysed.length === 1);
                assert(Object.keys(analysed[0]).length === 2);
                assert(analysed[0].stage === 1);
                assert(analysed[0].telemetry !== undefined);
                analysed[0].telemetry.forEach((val) => {
                    assert(val.time >= 166);
                    assert(val.time <= 212);
                });
                done();
            },
            next: function(err){
                assert(false);
                done();
            }
        };

        controller.getOne(req, res, function(err){
            assert(false);
            done();
        });
    });




    it("analysed/ with valid flight_number but with an invalid event in start", function(done){
        let req = {
            identifiers: {
                flight_number: 45,
            },
            modifiers: {
                start: "abc"
            }
        };

        let res = {
            send: function(analysed) {
                assert(false);
                done();
            },
            next: function(err){
                assert(false);
                done();
            }
        };

        controller.getOne(req, res, function(err){
            assert(err !== undefined);
            done();
        });
    });



    it("analysed/ with a valid flight_number and event", function(done){
        let req = {
            identifiers: {
                flight_number: 45
            },
            modifiers: {
                event: "boostback_start",
            }
        };

        let res = {
            send: function(analysed) {
                assert(analysed.length === 1);
                assert(Object.keys(analysed[0]).length === 2);
                assert(analysed[0].stage === 1);
                assert(analysed[0].telemetry !== undefined);
                assert(analysed[0].telemetry.length === 1);
                assert(_.isEqual(analysed[0].telemetry[0].toJSON(), { time: 166,
                    velocity: 1524.714,
                    altitude: 80.887,
                    velocity_y: 971.201,
                    velocity_x: 1174.682,
                    acceleration: -3.256,
                    downrange_distance: 64.931,
                    angle: 39.16,
                    q: 0 }));
                done();
            },
            next: function(err){
                assert(false);
                done();
            }
        };

        controller.getOne(req, res, function(err){
            assert(false);
            done();
        });
    });





    it("analysed/ with a valid flight_number and an invalid event should return an error", function(done){
        let req = {
            identifiers: {
                flight_number: 45
            },
            modifiers: {
                event: "not a real event",
            }
        };

        let res = {
            send: function(analysed) {
                assert(false);
                done();
            },
            next: function(err){

                assert(false);
                done();
            }
        };

        controller.getOne(req, res, function(err){

            assert(err !== undefined);
            done();
        });
    });




    it("analysed/ with a valid flight_number and event = null should return an error", function(done){
        let req = {
            identifiers: {
                flight_number: 45
            },
            modifiers: {
                event: null,
            }
        };

        let res = {
            send: function(analysed) {
                assert(false);
                done();
            },
            next: function(err){
                assert(false);
                done();
            }
        };

        controller.getOne(req, res, function(err){
            assert(true);
            done();
        });
    });

});


*/
