const dynamo = require("dynamodb");
const Joi = require("joi");



// Raw telemetry entry
const RawTelemetrySchema = {
    time: Joi.number(),
    velocity: Joi.number(),
    altitude: Joi.number()
};

// Analysed telemetry entry
const AnalysedTelemetrySchema = {
    time: Joi.number(),
    velocity: Joi.number(),
    altitude: Joi.number(),
    velocity_y: Joi.number(),
    velocity_x: Joi.number(),
    acceleration: Joi.number(),
    downrange_distance: Joi.number(),
    angle: Joi.number(),
    q: Joi.number()
};

// Raw telemetry of a specific stage
const StageRawTelemetrySchema = {
    stage: Joi.number(),
    telemetry: Joi.array().items(RawTelemetrySchema)
};

// Analysed telemetry of a specific stage
const StageAnalysedTelemetrySchema = {
    stage: Joi.number().integer().min(0),
    telemetry: Joi.array().items(AnalysedTelemetrySchema)
};

// Define the event schema
const EventSchema = {
    key: Joi.string(),
    time: Joi.number().allow(null)
};

// Define launch schema
const LaunchSchema = {
  hashKey : "flight_number",

  schema : {
      flight_number: Joi.number().integer().positive().required(),
      mission_id: Joi.string().required(),
      name: Joi.string().required(),
      raw: Joi.array().items(StageRawTelemetrySchema),
      analysed: Joi.array().items(StageAnalysedTelemetrySchema),
      events: Joi.array().items(EventSchema)
  },

  tableName: "launches"
};

// Define the DynamoDB model
const Launch = dynamo.define("Launch", LaunchSchema);

// Export the raw telemetry model
module.exports = Launch;
