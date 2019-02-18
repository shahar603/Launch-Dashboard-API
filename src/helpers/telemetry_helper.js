const _ = require("lodash");
const Launch = require("../models/launch");


async function eventsToStartEnd(events, modifiers){
    let start, end;

    if (events === null || events === undefined)
        return {start: undefined, end: undefined};

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

    start = eventToTime(events, modifiers.start);
    end = eventToTime(events, modifiers.end);

    if (start === undefined && modifiers.start !== undefined)
        throw new Error("\"start\" has to a number or an event");
    else if (start === null && modifiers.start !== undefined)
            throw new Error(`event ${modifiers.start} of "start" is not set in the data`);

    if (end === undefined && modifiers.end !== undefined)
        throw new Error("\"end\" has to a number or an event");
    else if (end === null && modifiers.end !== undefined)
            throw new Error(`event ${modifiers.end} of "end" is not set in the data`);

    return {start: start, end: end};
}


function cropTelemetry(start, end, telemetry){
    if (start === undefined)
        start = telemetry[0].time;
    if (end === undefined)
        end = telemetry[telemetry.length - 1].time;

    let startIndex = telemetry.findIndex(function(element) {
        return element.time >= start;
    });

    let endIndex = telemetry.findIndex(function(element) {
        return element.time >= end;
    });

    return telemetry.slice(Math.max(0, startIndex-1), endIndex);
}



function chooseStagesAndTelemetryRange(data, key, stage, start, end){
    let out = [];

    for (let i = 0; i < data[key].length; i++){
        if (stage === undefined || stage === data[key][i].stage){
            out.push({
                stage: data[key][i].stage,
                telemetry: cropTelemetry(start, end, data[key][i].telemetry)
            });
        }
    }

    return out;
}



async function getTelemetry(key, identifiers, modifiers){
    // Get the launch from the database
    let data = await Launch.findOne(identifiers, `${key} events`);


    if (!data){
        throw {status: 404, message: "Not Found"};
    }

    let {start, end} = await eventsToStartEnd(data.events, modifiers);
    console.log(start + ":" + end);
    let out = chooseStagesAndTelemetryRange(data, key, modifiers.stage, start, end);
    return out;
}




module.exports = getTelemetry;
