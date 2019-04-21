const _ = require("lodash");
const s3Helper = require("./s3_helper");
const mongoHelper = require("./mongo_helper");


async function eventsToStartEnd(events, modifiers){
    let start, end, eventTime;

    if (!events || !modifiers)
        return {};

    function eventToTime(eventsArray, event){
        // If event is not defined then return 'undefined'
        if(!event)
            return undefined;

        // If the 'event' is not a number then try to find the event
        if (_.isNaN(Number(event))){
            let res = _.find(eventsArray, {key: event});

            if (!res)
                return undefined;

            return res.time;
        }

        // 'event' is a number
        return Number(event);
    }


    // Get time values for "start", "end" and "eventTime"
    start = eventToTime(events, modifiers.start);
    end = eventToTime(events, modifiers.end);
    eventTime = eventToTime(events, modifiers.event);

    // Check the validity of "start", "end" and "eventTime"
    if (start === undefined && modifiers.start !== undefined)
        throw new Error("\"start\" has to a number or an event");
    else if (start === null && modifiers.start !== undefined)
            throw new Error(`event ${modifiers.start} of "start" is not set in the data`);

    if (end === undefined && modifiers.end !== undefined)
        throw new Error("\"end\" has to a number or an event");
    else if (end === null && modifiers.end !== undefined)
            throw new Error(`event ${modifiers.end} of "end" is not set in the data`);

    if (eventTime === undefined && modifiers.event !== undefined)
            throw new Error("\"event\" has to a number or an event");
        else if (eventTime === null && modifiers.event !== undefined)
            throw new Error(`event ${modifiers.event} of "event" is not set in the data`);


    // Apply offset modifiers
    if (start !== undefined && modifiers.start_offset != undefined){
        start += modifiers.start_offset;
    }
    if (end !== undefined && modifiers.end_offset != undefined){
        end += modifiers.end_offset;
    }
    if (eventTime !== undefined && modifiers.event_offset != undefined){
        eventTime += modifiers.event_offset;
    }



    return {start: start, end: end, event: eventTime};
}


function cropTelemetry(telemetry, start, end ,event){
    if (!telemetry || telemetry.length === 0)
        return [];
    if (start === undefined)
        start = telemetry[0].time;
    if (end === undefined)
        end = telemetry[telemetry.length - 1].time;
    if (event !== undefined)
        start = end = event;

    let startIndex = telemetry.findIndex(function(element) {
        return element.time >= start;
    });

    let endIndex = telemetry.findIndex(function(element) {
        return element.time > end;
    });



    // If start is after than all the telemetry or
    // end is before than all the telemetry
    if (startIndex === -1 || telemetry[0].time > end)
        return [];

    if (endIndex === -1)
        endIndex = telemetry.length;

    if (startIndex < endIndex)
        return telemetry.slice(Math.max(0, startIndex), endIndex);
    else
        return [telemetry[startIndex]];
}




function chooseStagesAndTelemetryRange(data, stage, start, end, event){
    let out = [];

    for (let i = 0; i < data.length; i++){
        if (stage === undefined || stage === data[i].stage){
            out.push({
                stage: data[i].stage,
                telemetry: cropTelemetry(data[i].telemetry, start, end, event)
            });
        }
    }

    return out;
}


//  Get 'key' telemetry from the 'identifiers' and modified using 'modifiers'
async function getTelemetry(key, identifiers, modifiers){
    if (!key || _.isEmpty(identifiers) || _.isNil(modifiers))
        throw {status: 404, message: "Not Found"};

    // Get the launch from the database
    let launchMetadata = await mongoHelper.findLaunchMetadata(identifiers);

    if (!launchMetadata){
        throw {status: 404, message: "Not Found"};
    }

    let events = await s3Helper.getFile(launchMetadata.events_path);
    let data;

    if (key === "raw")
        data = await s3Helper.getFile(launchMetadata.raw_path);
    else if (key === "analysed")
        data = await s3Helper.getFile(launchMetadata.analysed_path);

    let {start, end, event} = await eventsToStartEnd(events, modifiers);
    let out = chooseStagesAndTelemetryRange(data, modifiers.stage, start, end, event);
    return out;
}




module.exports = {
    cropTelemetry: cropTelemetry,
    getTelemetry: getTelemetry
};
