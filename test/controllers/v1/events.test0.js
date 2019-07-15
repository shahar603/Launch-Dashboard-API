const request = require("supertest");
const app = require("../../../src/app");


test("Get the events of JASON-3", async () => {
  const response = await request(app).get("/v1/events/spacex?flight_number=26");
  const telemetry = JSON.parse(response.text);

  expect(response.statusCode).toBe(200);
  
  expect(telemetry).toEqual([
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