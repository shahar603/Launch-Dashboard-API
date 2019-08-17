// Import mongodb
const mongoose = require("mongoose");
const keys = require("../../src/auth/keys");




// Connect to the database before any test run
beforeAll(function(done){
    global.CONNECTION_STRING = `mongodb+srv://${keys.mongodb.userID}:${keys.mongodb.userKey}@cluster0-q6hdl.mongodb.net/test?retryWrites=true`;
    // Connect to monsgoose and create/connect to the db

    mongoose.connect(global.CONNECTION_STRING, {useNewUrlParser: true});

    mongoose.connection.once("open", function(){
        console.log("Successfuly connected to the database!");
        done();
    }).on("error", function(err){
        console.log(`Connection Error: ${err}`);
    });
});


// Close the connection to the database when the tests are done
afterAll(async function(done){
    console.log("Closed the connection to the database");
    await mongoose.connection.close();
    done();
});
