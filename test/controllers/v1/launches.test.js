const request = require("supertest");
const app = require("../../../src/app");

beforeAll((done) => {
  app.on("ready", () => {
    done();
  });
});



test("Get info for all launches", async (done) => {
    const response = await request(app).get("/v1/launches/info");
    expect(response.statusCode).toBe(200);
    done();
});



afterAll(() => setTimeout(() => process.exit()), 1000);
