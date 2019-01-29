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
var tempFolder = __dirname + "/tmp";
var port = process.env.PORT || String(3000);
var upload = multer({
    dest: tempFolder
});
console.log("Hosting on: " + port);
var emptyTMP = function () {
    fs.access(tempFolder, function (err) {
        if (!err) {
            rimraf(tempFolder, function () {
                fs.mkdir(tempFolder, function () { return void {}; });
            });
        }
    });
};
emptyTMP();
app.post("/file_upload", upload.single("image"), function (req, res) {
    var file = tempFolder + "/" + req.file.filename + path.extname(req.file.originalname);
    res.send("/files/" + req.file.filename);
    var hashSha256 = crypto.createHash("sha256");
    hashSha256.update(req.body.password);
    var passwordHash = hashSha256.digest("hex");
    var fileObj = new Object({
        name: req.file.originalname,
        filename: req.file.filename,
        size: req.file.size,
        mimetype: req.file.mimetype,
        passwordHash: passwordHash,
        deleteTime: req.body.deleteTime
    });
    hashSha256.end();
    var fileObjJson = JSON.stringify(fileObj);
    fs.writeFile(tempFolder + "/" + req.file.filename + ".json", fileObjJson, function () { return void {}; });
    fs.rename(req.file.path, file, function (err) {
        if (err) {
            res.sendStatus(500);
            console.log(err);
        }
        else {
            temporaryHost(req.file.filename, path.extname(req.file.originalname), req.body.deleteTime);
        }
    });
});
var temporaryHost = function (fileName, fileExtension, deleteTime) {
    var serverEnded = false;
    app.get("/files/" + fileName, function (req, res) {
        if (serverEnded == false) {
            res.sendFile(tempFolder + "/" + fileName + fileExtension);
            deleteHost(req, res, deleteTime);
        }
        else {
            res.redirect("/");
        }
    });
    var deleteHost = function (req, res, deleteTime) {
        setTimeout(function () {
            serverEnded = true;
            fs.unlink(tempFolder + "/" + fileName + fileExtension, function () { return void {}; });
            fs.unlink(tempFolder + "/" + fileName + ".json", function () { return void {}; });
        }, deleteTime * 60000);
    };
};
app.get("/", function (req, res) {
    res.send("<p>heuua</p>");
});
app.use(express.static("./public"));
app.listen(port);
process.on("SIGINT", function () {
    emptyTMP();
});
process.on("SIGTERM", function () {
    emptyTMP();
});
