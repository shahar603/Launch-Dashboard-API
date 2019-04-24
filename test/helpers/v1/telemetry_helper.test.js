const telemety_helper = require("../../../src/helpers/telemetry_helper");

describe("Testing crop_telemetry", () => {
    let telemetry, telemetryWithGap;

    beforeAll(() => {
        telemetry = [
                {time: -1, velocity: -1, altitude: -1},
                {time: 0, velocity: 0, altitude: 0},
                {time: 1, velocity: 1, altitude: 1},
                {time: 2, velocity: 2, altitude: 2},
                {time: 3, velocity: 3, altitude: 3},
                {time: 4, velocity: 4, altitude: 4}
        ];


        telemetryWithGap = [
                {time: 0, velocity: 0, altitude: 0},
                {time: 1, velocity: 1, altitude: 1},
                {time: 2, velocity: 2, altitude: 2},
                {time: 3, velocity: 3, altitude: 3},
                {time: 4, velocity: 4, altitude: 4},
                {time: 100, velocity: 100, altitude: 100},
                {time: 101, velocity: 101, altitude: 101},
                {time: 102, velocity: 102, altitude: 102},
                {time: 103, velocity: 103, altitude: 103}
        ];
    });


    test("start, end and event are undefined returns telemetry", () => {
        expect(telemety_helper.cropTelemetry(telemetry, undefined, undefined, undefined)).
        toEqual(telemetry);
    });

    test("start=null,end=null,event=null returns telemetry", () => {
        expect(telemety_helper.cropTelemetry(telemetry, null, null, null)).
        toEqual(telemetry);
    });


    test("start=0,end=2,event=undefined should return telemetry at times 0, 1, 2", () => {
        expect(telemety_helper.cropTelemetry(telemetry, 0, 2, undefined)).
        toEqual([
                {time: 0, velocity: 0, altitude: 0},
                {time: 1, velocity: 1, altitude: 1},
                {time: 2, velocity: 2, altitude: 2}
            ]);
    });


    test("start=0,end=2,event=undefined should return telemetry at times 0, 1, 2", () => {
        expect(telemety_helper.cropTelemetry(telemetry, 0, 2, undefined)).
        toEqual([
                {time: 0, velocity: 0, altitude: 0},
                {time: 1, velocity: 1, altitude: 1},
                {time: 2, velocity: 2, altitude: 2}
            ]);
    });



    test("start=-2,end=2,event=undefined should return telemetry at times 0, 1, 2", () => {
        expect(telemety_helper.cropTelemetry(telemetry, -1, 2, undefined)).
        toEqual([
                {time: -1, velocity: -1, altitude: -1},
                {time: 0, velocity: 0, altitude: 0},
                {time: 1, velocity: 1, altitude: 1},
                {time: 2, velocity: 2, altitude: 2}
            ]);
    });


    test("start=2,end=7,event=undefined should return telemetry at times 2, 3, 4", () => {
        expect(telemety_helper.cropTelemetry(telemetry, 2, 7, undefined)).
        toEqual([
                {time: 2, velocity: 2, altitude: 2},
                {time: 3, velocity: 3, altitude: 3},
                {time: 4, velocity: 4, altitude: 4}
            ]);
    });



    test("start=undefined,end=undefined,event=3 should return telemetry at times 3", () => {
        expect(telemety_helper.cropTelemetry(telemetry, undefined, undefined, 3)).
        toEqual([
                {time: 3, velocity: 3, altitude: 3}
            ]);
    });



    test("start=undefined,end=undefined,event=13 should return an empty array", () => {
        expect(telemety_helper.cropTelemetry(telemetry, undefined, undefined, 13)).
        toEqual([]);
    });


    test("start=undefined,end=undefined,event=0.5 should return telemetry at 1", () => {
        expect(telemety_helper.cropTelemetry(telemetry, undefined, undefined, 0.5)).
        toEqual([{time: 1, velocity: 1, altitude: 1}]);
    });


    test("start=undefined,end=undefined,event=-10 should return an empty array", () => {
        expect(telemety_helper.cropTelemetry(telemetry, undefined, undefined, -10)).
        toEqual([]);
    });


    test("start=undefined,end=undefined,event=13 should return an empty array", () => {
        expect(telemety_helper.cropTelemetry(telemetryWithGap, undefined, undefined, 13)).
        toEqual([]);
    });


    test("start=undefined,end=undefined,event=-0.1 should return telemetrt at T+0", () => {
        expect(telemety_helper.cropTelemetry(telemetryWithGap, undefined, undefined, -0.1)).
        toEqual([{time: 0, velocity: 0, altitude: 0}]);
    });

    test("start=undefined,end=undefined,event=-0.1, eventWindow=0.01 should return an empty array", () => {
        expect(telemety_helper.cropTelemetry(telemetryWithGap, undefined, undefined, -0.1, 0.01)).
        toEqual([]);
    });

});
