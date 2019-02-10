// Import assert to unit test the database
const assert = require("assert");
const rp = require("request-promise");


// Create a series of tests
describe("Testing the API is returning the correct data", function(){

    
    // Make sure the info returns only metadata fields
    /*it("Make sure the info returns only metadata fields", function(done){
        rp("http://localhost:3000/v1/launches/info")
            .then(function (result) {
                let launches = JSON.parse(result);
                for(let i = 0; i < launches.length; i++){
                    Object.keys(launches[i]).forEach((val) => ["_id", "name", "mission_id", "flight_number"].includes(val));
                }
                assert(launches[0].mission_id === "orbcomm-og2-m2");
                assert(launches[0].name === "Orbcomm OG2");
                assert(launches[0].flight_number === 25);
                done();
            })
            .catch(function (err) {
                console.log(err);
                assert(false);
                done();
            });
    });*/
});
