"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var v8 = require("v8-compile-cache");
v8;
var multer = require("multer");
var express = require("express");
var rimraf = require("rimraf");
var fs = require("fs");
var path = require("path");
var moment = require("moment");
//import crypto = require("crypto");
var app = express();
var tempFolder = __dirname + "/tmp";
var port = process.env.PORT || String(3000);
var upload = multer({
    dest: tempFolder
});
console.log("Hosting on: " + port);
var emptyTMP = function (callback) {
    fs.access(tempFolder, function (err) {
        if (!err) {
            rimraf(tempFolder, function () {
                fs.mkdir(tempFolder, function () { return void {}; });
            });
        }
    });
};
emptyTMP();
app.set('view engine', 'pug');
app.post("/file_upload", upload.single("image"), function (req, res) {
    var file = tempFolder + "/" + req.file.filename + path.extname(req.file.originalname);
    res.send("/files/" + req.file.filename);
    //var hashSha256: crypto.Hash = crypto.createHash("sha256");
    //hashSha256.update(req.body.password);
    //var passwordHash: String = hashSha256.digest("hex");
    var fileObj = new Object({
        name: req.file.originalname,
        filename: req.file.filename,
        size: req.file.size,
        mimetype: req.file.mimetype,
        //passwordHash: passwordHash,
        deleteTime: req.body.deleteTime
    });
    //hashSha256.end();
    var fileObjJson = JSON.stringify(fileObj);
    fs.writeFile(tempFolder + "/" + req.file.filename + ".json", fileObjJson, function () { return void {}; });
    fs.rename(req.file.path, file, function (err) {
        if (err) {
            res.sendStatus(500);
            console.log(err);
        }
        else {
            temporaryHost(req.file.filename, path.extname(req.file.originalname), req.body.deleteTime, req.file.originalname);
        }
    });
});
var temporaryHost = function (fileName, fileExtension, deleteTime, originalTitle) {
    var serverEnded = false;
    var deleteAt = moment().add(parseFloat(deleteTime), "minutes").format("HH:mm:ss");
    app.get("/files/" + fileName, function (req, res) {
        if (serverEnded == false) {
            //res.sendFile(__dirname)
            res.render("files/index", {
                pugImage: "/files/temp/" + fileName,
                pugDeleteTime: deleteAt,
                pugImageTitle: originalTitle,
                pugUploadTime: moment().format("MMMM Do YYYY, HH:mm:ss")
            });
            deleteHost(deleteTime);
        }
        else {
            res.redirect("/");
        }
    });
    app.get("/files/temp/" + fileName, function (req, res) {
        if (serverEnded == false) {
            res.sendFile(tempFolder + "/" + fileName + fileExtension);
            deleteHost(deleteTime);
        }
        else {
            res.redirect("/");
        }
    });
    var deleteHost = function (deleteTime) {
        setTimeout(function () {
            serverEnded = true;
            fs.unlink(tempFolder + "/" + fileName + fileExtension, function () { return void {}; });
            fs.unlink(tempFolder + "/" + fileName + ".json", function () { return void {}; });
        }, deleteTime * 60000); //60000 is a min.
    };
};
app.get("/", function (req, res) {
    res.redirect("/upload");
});
app.get("/upload", function (req, res) {
    res.render("upload/index", {});
});
app.use(express.static("./public"));
app.listen(port);
