const _ = require("lodash");
const Launch = require("../models/launch");


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
        return element.time >= end;
    });

    if (startIndex === -1 || endIndex === -1 || endIndex < startIndex)
        return [];

    if (startIndex < endIndex)
        return telemetry.slice(Math.max(0, startIndex), endIndex);
    else
        return [telemetry[startIndex]];
}




function chooseStagesAndTelemetryRange(data, key, stage, start, end, event){
    let out = [];

    for (let i = 0; i < data[key].length; i++){
        if (stage === undefined || stage === data[key][i].stage){
            out.push({
                stage: data[key][i].stage,
                telemetry: cropTelemetry(data[key][i].telemetry, start, end, event)
            });
        }
    }

    return out;
}



async function getTelemetry(key, identifiers, modifiers){
    if (!key || _.isEmpty(identifiers) || _.isNil(modifiers))
        throw {status: 404, message: "Not Found"};

    // Get the launch from the database
    let data = await Launch.findOne(identifiers, `${key} events`);

    if (!data){
        throw {status: 404, message: "Not Found"};
    }

    let {start, end, event} = await eventsToStartEnd(data.events, modifiers);
    let out = chooseStagesAndTelemetryRange(data, key, modifiers.stage, start, end, event);
    return out;
}




module.exports = getTelemetry;
