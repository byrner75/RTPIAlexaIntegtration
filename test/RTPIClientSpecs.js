var expect = require("chai").expect;
var RTPIClient = require("../src/RTPIClient");

describe('RTPIClient tests', function () {
    
    

    it('should return errorcode 0', function (done) {
        var client = new RTPIClient();
        client.realtimeInformation("4182", "145", "bac", 1, function (json) {
            expect(json.result.errorcode).to.equal(0);
        });
        done();
    });

    it('should return errorcode 1', function (done) {
        var client = new RTPIClient();
        client.realtimeInformation("9999", "145", "bac", 1, function (json) {
            expect(json.result.errorcode).to.equal(1);
        });
        done();
    })
})
