// Import mongodb
const mongoose = require("mongoose");
const keys = require("../../src/auth/keys");




// Connect to the database before any test run
before(function(done){
    global.CONNECTION_STRING = keys.mongodb.connectionString;
    // Connect to monsgoose and create/connect to the db

    console.log(process.env.DB_CONNECTION_STRING === undefined);
    console.log(keys.mongodb.connectionString === undefined);
    console.log(global.CONNECTION_STRING === undefined);

    mongoose.connect(global.CONNECTION_STRING, {useNewUrlParser: true});

    mongoose.connection.once("open", function(){
        console.log("Successfuly connected to the database!");
        done();
    }).on("error", function(err){
        console.log(`Connection Error: ${err}`);
    });
});


// Close the connection to the database when the tests are done
after(function(){
    console.log("Closed the connection to the database");
    mongoose.connection.close();
});


/* Don't drop the launches collection before each test
// Drop the launches collection before each test
beforeEach(function(done){
    mongoose.connection.collections.launches.drop().then(function(){
        done();
    }).catch(function(err){
        console.log(err.message);
        done();
    });
});
*/
