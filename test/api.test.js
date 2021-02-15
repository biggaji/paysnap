// const chai = require("chai");
// const chaiHTTP = require("chai-http");
// const server = require("../app");
// const should = chai.should();
// chai.use(chaiHTTP);

// // Test for the index page
// // require("crypto").randomBytes(36).toString("hex");
// // describe the test 
// describe("Test suite for the paytr api server", () => {
//     /**
//      * Test for GET route
//      */
//     describe("GET /", () => {
//         it("Should return all coins", (done) => {
//             chai.request(server)
//                 .get('/')
//                 .end((err, res) => {
//                     res.should.have.status(200);
//                     res.body.should.be.a("array");
//                     res.body.length.should.be.eq(5);
//                     done();
//                 });
//         });
//     });

//     /**
//      * Should create a coin
//      */

//     describe("POST /create_coin", () => {
//         it("Should create a new crypto coin", (done) => {
//             const NEW_COIN = {
//                 "name": "PAYCOIN",
//                 "abbr": "PYC"
//             }
//             chai.request(server)
//                 .post('/create_coin')
//                 .send(NEW_COIN)
//                 .end((err, res) => {
//                     res.should.have.status(200);
//                     res.body.should.have.property("name");
//                     res.body.should.be.a("object");
//                     done();
//                 })
//         })
//     })
// });