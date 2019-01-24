"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var v8 = require("v8-compile-cache");
v8;
var multer = require("multer");
var express = require("express");
var rimraf = require("rimraf");
var fs = require("fs");
var path = require("path");
var crypto = require("crypto");
//Path
var app = express();
var tempFolder = "./tmp";
var port = process.env.PORT || 3000;
var hashSha256 = crypto.createHash("sha256");
var upload = multer({
    dest: tempFolder
});
fs.access(tempFolder, function (err) {
    if (!err) {
        rimraf(tempFolder, function () {
            fs.mkdir(tempFolder, function () { return void {}; });
        });
    }
});
app.post("/file_upload", upload.single("image"), function (req, res) {
    var file = __dirname + "/tmp/" + req.file.filename + path.extname(req.file.originalname);
    var fileObj = new Object({
        name: req.file.originalname,
        filename: req.file.filename,
        size: req.file.size,
        mimetype: req.file.mimetype,
        passwordHash: hashSha256.digest(req.body.password),
        deleteTime: req.body.deleteTime
    });
    var fileObjJson = JSON.stringify(fileObj);
    fs.writeFile(__dirname + "/tmp/" + req.file.name + ".json", fileObjJson, function () { return void {}; });
    fs.rename(req.file.path, file, function (err) {
        if (err) {
            res.sendStatus(500);
            console.log(err);
        }
        else {
            temporaryHost(req.file.filename, path.extname(req.file.originalname), fileObj.deleteTime);
        }
    });
});
var temporaryHost = function (fileName, fileExtension, deleteTime) {
    app.get("/files/" + fileName, function (req, res) {
        res.sendFile(__dirname + "/tmp/" + fileName + fileExtension);
    });
};
app.get("/", function (req, res) {
    //res.sendFile(__dirname + "/public/index.html");
    res.send("<p>heuua</p>");
});
app.use(express.static("./public"));
app.listen(port);
