const chai = require("chai");
const should = chai.should();
const app = require('../app');
const chaiHTTP = require("chai-http");

chai.use(chaiHTTP);


describe("GET /", () => {
    // Test goes here
    it("It should return a status 200", (done) => {
        chai.request(app)
            .get("/")
            .end((err, res) => {
                res.should.have.status(200);
                done();
            });
    });
});