/*jshint esversion: 6 */
const MongoClient = require("mongodb").MongoClient;
var url = "mongodb://localhost/userdb";

MongoClient.connect(url, {
    useNewUrlParser: true
}, function (err, db) {
    if (err) throw err;
    console.log("Database created!");
    db.close();
});