/*jshint esversion: 6 */
const MongoClient = require("mongodb").MongoClient;
var url = "mongodb://localhost/userdb";

MongoClient.connect(url, function (err, db) {
    if (err) throw err;
    var dbo = db.db("mydb");
    dbo.createCollection("customers", function (err, res) {
        if (err) throw err;
        console.log("Collection created!");
        db.close();
    });
});