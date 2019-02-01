// Import Joi for schema validation
const Joi = require("joi");
// Import mongoose and create a Schema for courses
const mongoose = require("mongoose");
const joigoose = require("joigoose")(mongoose);
// Get the Schema object from mongoose
const Schema = mongoose.Schema;





// Raw telemetry of a specific stage
const StageRawTelemetrySchema = Joi.object().keys({
    stage: Joi.number().integer().min(0),
    telemetry: [{
        time: Joi.number(),
        velocity: Joi.number(),
        altitude: Joi.number()
    }]
});

// Analysed telemetry of a specific stage
const StageAnalysedTelemetrySchema = Joi.object().keys({
    stage: Joi.number().integer().min(0),
    telemetry: [{
        time: Joi.number(),
        velocity: Joi.number(),
        altitude: Joi.number(),
        velocity_y: Joi.number(),
        velocity_x: Joi.number(),
        acceleration: Joi.number(),
        downrange_distance: Joi.number(),
        angle: Joi.number(),
        q: Joi.number()
    }]
});

// Define the event schema
const EventSchema = Joi.object().keys({
    key: Joi.string(),
    time: Joi.number()
});

// Define launch schema
const LaunchSchema = Joi.object().keys({
    id: Joi.string().required(),
    name: Joi.string().required(),
    flight_number: Joi.number().integer().min(0).required(),
    raw: [StageRawTelemetrySchema],
    analysed: [StageAnalysedTelemetrySchema],
    events: [EventSchema]
});




// Create the raw telemetry model
const Launch = mongoose.model("launch", joigoose.convert(LaunchSchema));
// Export the raw telemetry model
module.exports = Launch;
