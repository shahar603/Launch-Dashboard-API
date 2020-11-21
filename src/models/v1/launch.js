const Joi = require("joi");

const rawTelemetry = Joi.object().keys({
    time: Joi.number().required(),
    velocity: Joi.number().required(),
    altitude: Joi.number().required()
});

const analysedTelemetry = Joi.object().keys({
    time: Joi.number(),
    velocity: Joi.number(),
    altitude: Joi.number(),
    velocity_y: Joi.number(),
    velocity_x: Joi.number(),
    acceleration: Joi.number(),
    downrange_distance: Joi.number(),
    angle: Joi.number(),
    q: Joi.number()
});

const eventData = Joi.object().keys({
    key: Joi.string().required(),
    time: Joi.number().required().allow(null)
});

const rawData = Joi.object().keys({
    stage: Joi.number().integer().min(0),
    telemetry: Joi.array().items(rawTelemetry)
});

const analysedData = Joi.object().keys({
    stage: Joi.number().integer().min(0),
    telemetry: Joi.array().items(analysedTelemetry)
});

const SpaceXLaunchFile = Joi.object({
    company_id: Joi.string().required(),
    mission_id: Joi.string().required(),
    flight_number: Joi.number().integer().positive().required(),
    launch_library_id: Joi.number().integer().required(),
    name: Joi.string().required(),
    raw: Joi.array().items(rawData),
    analysed: Joi.array().items(analysedData),
    events: Joi.array().items(eventData)
});

module.exports = SpaceXLaunchFile;


