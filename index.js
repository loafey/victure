/*jshint esversion: 6 */
require('v8-compile-cache');
const multer = require("multer");
const express = require("express");
const rimraf = require("rimraf");
const app = express();
const path = require("path");
const port = 3000;
const upload = multer({
    dest: "./tmp/"
});
const fs = require("fs");

app.get("/", function (req, res) {
    res.sendFile(path.join(__dirname + "/public/index.html"));
});

fs.access("./tmp", (err) => {
    if (!err) {
        rimraf("./tmp", function () {
            fs.mkdir("./tmp", function () {
                return;
            });
        });
    }
    //fs.mkdir("./tmp");
});

app.post("/file_upload", upload.single("image"), function (req, res) {
    console.log(req.body);
    console.log(req.file);
    var file = __dirname + "/tmp/" + req.file.filename;

    var fileObj = new Object({});
    fileObj.name = req.file.originalname;
    fileObj.filename = req.file.filename;
    fileObj.size = req.file.size;
    fileObj.mimetype = req.file.mimetype;
    fileObj.password = req.body.password;
    fileObj.deleteTime = req.body.deleteTime;
    var fileObjJson = JSON.stringify(fileObj);
    fs.writeFile(__dirname + "/tmp/" + req.file.filename + ".json", fileObjJson, function () {
        return;
    });
    console.table(fileObjJson);

    console.log(file);
    fs.rename(req.file.path, file, function (err) {
        if (err) {
            res.sendStatus(500);
            console.log(err);
        } else {
            temporaryHost(req.file.filename);
        }
    });
});

var temporaryHost = function (fileName) {
    app.get("/files/" + String(fileName), function (req, res) {
        res.send("<p>" + String(fileName) + "</p> <img src='" + __dirname + "/tmp/" + String(fileName) + "'>");
    });
};

app.use(express.static("./public"));
app.listen(port);