const {cropTelemetry} = require("../helpers/telemetry_helper");


global.LIVE_TELEMETRY = {
    "raw": [],
    "analysed": []
};


const allowedEvents = ["raw", "analysed"];


module.exports = {
    info: function(req, res, next){
        res.send({
            telemetryType: allowedEvents
        });
    },


    telemetry: function(req, res, next){
        if(!req.modifiers.type){
            throw {status: 404, message: "\"type\" not Found"};
        }

        if(!allowedEvents.includes(req.modifiers.type)){
            throw {status: 422, message: `"type" '${req.modifiers.type}' is not allowed`};
        }

        res.send(cropTelemetry(
            global.LIVE_TELEMETRY[req.modifiers.type],
            req.modifiers.start,
            req.modifiers.end,
            undefined
        ));
    },


    resetLiveEvent: function(req, res, next){
        Object.keys(global.LIVE_TELEMETRY).forEach(function(key){
            global.LIVE_TELEMETRY[key] = [];
        });
        res.send("reset live event");
    }

};
