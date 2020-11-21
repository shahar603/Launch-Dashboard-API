// Import mocha and assert to unit test the database
const assert = require("assert");
const requestSplitter = require("../../src/middleware/v1/request_splitting");
// Equality function
const _ = require("lodash");

describe("Testing the middleware", function(){

    it("Basic object splitting", function(done){
        let req = {query: {mission_id: "crs-12", start: 1234}};
        let res = {};
        let next = function(){
            assert(_.isEqual(req.identifiers, {mission_id: "crs-12"}) &&
            _.isEqual(req.modifyers, {start: 1234}));
        };

        requestSplitter(req, res, next);
        done();
    });


    it("More complex object splitting", function(done){
        let req = {query: {mission_id: "crs-13", flight_number: 1337, finish: 1235, start: 1234}};
        let res = {};
        let next = function(){
            assert(_.isEqual(req.identifiers, {mission_id: "crs-13", flight_number: 1337}) &&
            _.isEqual(req.modifyers, { finish: 1235, start: 1234}));
        };

        requestSplitter(req, res, next);
        done();
    });


});
