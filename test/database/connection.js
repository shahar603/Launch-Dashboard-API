// Import mongodb
const mongoose = require("mongoose");
<<<<<<< HEAD
const keys = require("../../src/auth/keys");
=======
>>>>>>> 102639e5c46d1011252463fa6b01c4b4930e75a1




// Connect to the database before any test run
before(function(done){
<<<<<<< HEAD
    global.CONNECTION_STRING = `mongodb://${keys.mongodb.userID}:${keys.mongodb.userKey}@spacecluster-shard-00-00-duhqc.mongodb.net:27017,spacecluster-shard-00-01-duhqc.mongodb.net:27017,spacecluster-shard-00-02-duhqc.mongodb.net:27017/test?ssl=true&replicaSet=SpaceCluster-shard-0&authSource=admin&retryWrites=true`;
=======
    global.CONNECTION_STRING = "mongodb+srv://api-read-access:spacedashboard@spacecluster-duhqc.mongodb.net/test?retryWrites=true";
>>>>>>> 102639e5c46d1011252463fa6b01c4b4930e75a1

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
