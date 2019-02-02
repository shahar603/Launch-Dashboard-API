// Import mongoose and create a Schema for courses
const mongoose = require("mongoose");
// Get the Schema object from mongoose
const Schema = mongoose.Schema;





// Raw telemetry of a specific stage
const StageRawTelemetrySchema = new Schema({
    stage: Number,
    telemetry: [{
        time: Number,
        velocity: Number,
        altitude: Number
    }]
});

// Analysed telemetry of a specific stage
const StageAnalysedTelemetrySchema = new Schema({
    stage: {
        type: Number,
        min: 0
    },
    telemetry: [{
        time: Number,
        velocity: Number,
        altitude: Number,
        velocity_y: Number,
        velocity_x: Number,
        acceleration: Number,
        downrange_distance: Number,
        angle: Number,
        q: Number
    }]
});

// Define the event schema
const EventSchema = new Schema({
    key: String,
    time: Number
});

// Define launch schema
const LaunchSchema = new Schema({
    id: {
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
    raw: [StageRawTelemetrySchema],
    analysed: [StageAnalysedTelemetrySchema],
    events: [EventSchema]
}, { collection: "launches"});




// Create the raw telemetry model
const Launch = mongoose.model("launch", LaunchSchema);
// Export the raw telemetry model
module.exports = Launch;
