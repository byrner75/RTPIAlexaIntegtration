'use strict';
var AWS = require("aws-sdk");
var Q = require("q");
var util = require("util");

AWS.config.update({
  region: "us-west-2",
  endpoint: "http://localhost:8000"
});

function UserProfileDao() {
    this.tableName = "UserProfiles";
    this.dynamodb = new AWS.DynamoDB();
    this.docClient = new AWS.DynamoDB.DocumentClient();

    /**
     * make a call and return a promise, the promise is completed
     * with the outcome of the call
     */
    this.makeCall = function(ctx, fn, params) {
        var deferred = Q.defer();
        ctx[fn].apply(ctx, [params, function(err, data) {
            if(err) {
                console.log("-err");
                deferred.reject(err);
            }
            else {
                console.log("+ok");
                deferred.resolve(data);
            }
        }]);    
        return deferred.promise;
    }
}

UserProfileDao.prototype.tableExists = function() {
    var deferred = Q.defer();
    var that = this;
    this.makeCall(this.dynamodb, "listTables", {}).then(function(data) {
        deferred.resolve(data.TableNames.indexOf(that.tableName) >= 0)    
    },
    function(err) {
        deferred.reject(err);
    });
    return deferred.promise;
};

UserProfileDao.prototype.createTable = function() {
    var params = {
        TableName : this.tableName,
        KeySchema: [       
            { AttributeName: "userId", KeyType: "HASH"}  //Partition key
        ],
        AttributeDefinitions: [       
            { AttributeName: "userId", AttributeType: "S" }
        ],
        ProvisionedThroughput: {       
            ReadCapacityUnits: 10, 
            WriteCapacityUnits: 10
        }
    };
    console.log("Creating table " + this.tableName);
    return this.makeCall(this.dynamodb, "createTable", params);
};

UserProfileDao.prototype.dropTable = function() {
    var params = {
        TableName: this.tableName
    };

    return this.makeCall(this.dynamodb, "deleteTable", params);
};

UserProfileDao.prototype.getUserProfile = function(userId) {
    var params = {
        TableName: this.tableName,
        Key:{
            "userId": userId
        }
    };
    return this.makeCall(this.docClient, "get", params);
};

UserProfileDao.prototype.storeFavouriteStop = function(userId, favouriteStop) {
    var params = {
        TableName: this.tableName,
        Key: {
            "userId":userId        
        },
        UpdateExpression: "SET info.FavouriteStop = :favouriteStop",
        ExpressionAttributeValues: { 
            ":favouriteStop": favouriteStop
        },
        ReturnValues: "ALL_NEW"
    };
    return this.makeCall(this.docClient, "update", params);
};

UserProfileDao.prototype.createUserProfile = function(userId, userProfile) {
    var params = {
        TableName: this.tableName,
        Item:{
            "userId": userId,
            "info": userProfile 
        },
        ConditionExpression: "attribute_not_exists(userId)"
    };
    return this.makeCall(this.docClient, "put", params);
};

UserProfileDao.prototype.deleteUserProfile = function(userId) {
    var params = {
        TableName: this.tableName,
        Key: {
            "userId":userId        
        }
    };
    return this.makeCall(this.docClient, "delete", params);
};

module.exports = UserProfileDao;