import { expect } from "chai";
import request from "supertest";
import app from "../src/app.js"

describe("GET /location", () => {
    it("respond with json", (done) => {
        request(app)
            .get("/v1/location")
            .set("Accept", "application/json")
            .expect("Content-Type", /json/)
            .expect(200, done);
    });
});

describe("GET /current", () => {
    it("it response with error 404", (done) => {
        request(app)
            .get("/v1/current/Lksfff")
            .expect(404, done)
    });
    it("it response has a property weather", (done) => {
        request(app)
            .get("/v1/current/london")
            .set("Accept", "application/json")
            .expect("Content-Type", /json/)
            .expect(200)
            .then((res) => {
                expect(res.body).to.haveOwnProperty("weather")
                done()
            })
            .catch(err => done(err))
    });
});

describe("GET /forecast", () => {
    it("response with a city called Buenos Aires", (done) => {
        request(app)
            .get("/v1/forecast/buenos aires")
            .set("Accept", "application/json")
            .expect("Content-Type", /json/)
            .expect(200)
            .then((res) => {
                expect(res.body.city.name).to.eql("Buenos Aires")
                done()
            })
            .catch(err => done(err))

    });
});