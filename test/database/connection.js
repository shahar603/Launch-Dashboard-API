// Import mongodb
const mongoose = require("mongoose");


// Connect to the database before any test run
before(function(done){
    // Connect to monsgoose and create/connect to the db
    mongoose.connect("mongodb://localhost:27017/mongotest", {useNewUrlParser: true});

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



// Drop the launches collection before each character test
beforeEach(function(done){
    mongoose.connection.collections.launches.drop().then(function(){
        done();
    }).catch(function(err){
        console.log(err.message);
        done();
    });
});
