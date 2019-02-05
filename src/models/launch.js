// Import mongoose and create a Schema
const mongoose = require("mongoose");
// Get the Schema object from mongoose
const Schema = mongoose.Schema;



// Raw telemetry entry
const RawTelemetrySchema = new Schema({
    time: Number,
    velocity: Number,
    altitude: Number
}, { _id : false });

// Analysed telemetry entry
const AnalysedTelemetrySchema = new Schema({
    time: Number,
    velocity: Number,
    altitude: Number,
    velocity_y: Number,
    velocity_x: Number,
    acceleration: Number,
    downrange_distance: Number,
    angle: Number,
    q: Number
}, { _id : false });

// Raw telemetry of a specific stage
const StageRawTelemetrySchema = new Schema({
    stage: Number,
    telemetry: [RawTelemetrySchema]
}, { _id : false });

// Analysed telemetry of a specific stage
const StageAnalysedTelemetrySchema = new Schema({
    stage: {
        type: Number,
        min: 0
    },
    telemetry: [AnalysedTelemetrySchema]
}, { _id : false });

// Define the event schema
const EventSchema = new Schema({
    key: String,
    time: Number
}, { _id : false });

// Define launch schema
const LaunchSchema = new Schema({
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
    raw: [StageRawTelemetrySchema],
    analysed: [StageAnalysedTelemetrySchema],
    events: [EventSchema]
}, { collection: "launches"});




// Create the raw telemetry model
const Launch = mongoose.model("launch", LaunchSchema);
// Export the raw telemetry model
module.exports = Launch;
