/**
* Test for paytr auth routes and controllers 
*/

const chai = require("chai");
const should = chai.should();
const app = require('../app');
const chaiHTTP = require("chai-http");

chai.use(chaiHTTP);


describe("Tests for all paytr api", () => {
    // Test goes here

    describe("GET /create_account", () => {

        it("it should return status 200", (done) => {
            chai.request(app)
                .get('/create_account')
                .end((err, res) => {
                    res.should.have.status(200);
                    done();
                })
        })
    })
});
