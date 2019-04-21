// Import mongoose and create a Schema
const mongoose = require("mongoose");
// Get the Schema object from mongoose
const Schema = mongoose.Schema;



const LaunchFileSchema = new Schema({
    mission_id: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    flight_number: {
        type: Number,
        required: true,
        min: 0
    },
    raw_path: String,
    analysed_path: String,
    events_path: String
}, { collection: "launchFiles"});



// Create the raw telemetry model
const Launch = mongoose.model("launch", LaunchFileSchema);
// Export the raw telemetry model
module.exports = Launch;
