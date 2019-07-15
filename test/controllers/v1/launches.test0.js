const request = require("supertest");
const app = require("../../../src/app");

beforeAll((done) => {
  app.on("ready", () => {
    done();
  });
});


test("Get info for all launches", async (done) => {
    const response = await request(app).get("/v1/launches");
    expect(response.statusCode).toBe(422);
    done();
});


test("Get all telemetry of JASON-3", async () => {
  const response = await request(app).get("/v1/launches/spacex?flight_number=26");
  const telemetry = JSON.parse(response.text);

  expect(response.statusCode).toBe(200);
  expect(new Set(Object.keys(telemetry))).toEqual(new Set(["mission_id", "name", "flight_number", "raw", "analysed", "events"]));
  
  expect(telemetry.raw.length).toBe(1);
  expect(telemetry.raw[0].stage).toBe(2);
  expect(telemetry.raw[0].telemetry.length).toBe(34795);

  expect(telemetry.analysed.length).toBe(1);
  expect(telemetry.analysed[0].stage).toBe(2);
  expect(telemetry.analysed[0].telemetry.length).toBe(557);


  expect(new Set(Object.keys(telemetry.raw[0].telemetry[0]))).toEqual(new Set(["time", "velocity", "altitude"]));
  expect(new Set(Object.keys(telemetry.analysed[0].telemetry[0]))).toEqual(new Set(["time", "velocity", "altitude",
   "velocity_x", "velocity_y", "acceleration", "downrange_distance", "angle", "q"]));
  
  expect(telemetry.events).toEqual([
    { key: "maxq", time: 79 },
    { key: "throttle_down_start", time: null },
    { key: "throttle_down_end", time: null },
    { key: "meco", time: 155 },
    { key: "boostback_start", time: null },
    { key: "boostback_end", time: null },
    { key: "apogee", time: null },
    { key: "entry_start", time: null },
    { key: "entry_end", time: null },
    { key: "landing_start", time: null },
    { key: "landing_end", time: null },
    { key: "ses1", time: 166 },
    { key: "seco1", time: 545 },
    { key: "ses2", time: null },
    { key: "seco2", time: null } 
  ]);
});





