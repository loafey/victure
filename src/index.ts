import v8 = require("v8-compile-cache");
v8;
import multer = require("multer");
import express = require("express");
import rimraf = require("rimraf");
import fs = require("fs");
import path = require("path");
import crypto = require("crypto");
//Path

var app = express();
var tempFolder: string = __dirname + "/tmp";
var port = process.env.PORT || 3000;
var hashSha256: crypto.Hash = crypto.createHash("sha256");
var upload = multer({
    dest: tempFolder
});

console.log("Hosting on: " + port);

fs.access(tempFolder, (err) => {
    if (!err) {
        rimraf(tempFolder, () => {
            fs.mkdir(tempFolder, () => void {});
        });
    }
});

app.post("/file_upload", upload.single("image"), (req: any, res: any) => {
    var file: string = __dirname + "/tmp/" + req.file.filename + path.extname(req.file.originalname);

    res.send("/files/" + req.file.filename);

    var fileObj: any = new Object({
        name: req.file.originalname,
        filename: req.file.filename,
        size: req.file.size,
        mimetype: req.file.mimetype,
        //passwordHash: hashSha256.digest(req.body.password),
        deleteTime: req.body.deleteTime
    });

    var fileObjJson: string = JSON.stringify(fileObj);

    fs.writeFile(__dirname + "/tmp/" + req.file.filename + ".json", fileObjJson, () => void {});

    fs.rename(req.file.path, file, (err) => {
        if (err) {
            res.sendStatus(500);
            console.log(err);
        } else {
            temporaryHost(req.file.filename, path.extname(req.file.originalname), fileObj.deleteTime);
        }
    });
});

var temporaryHost = (fileName: any, fileExtension: string, deleteTime: any) => {
    var serverEnded: boolean = false;
    console.log("Starting: " + fileName);
    app.get("/files/" + fileName, (req, res) => {
        if (serverEnded == false) {
            res.sendFile(__dirname + "/tmp/" + fileName + fileExtension);
            deleteHost(req, res, deleteTime);
            console.log("Ending in: " + deleteTime * 1000);
        } else {
            res.redirect("/");
        }
    });
    var deleteHost = (req, res, deleteTime) => {
        setTimeout(() => {
            console.log("Ending: " + fileName);
            serverEnded = true;
            fs.unlink(__dirname + "/tmp/" + fileName + fileExtension, () => void {});
            fs.unlink(__dirname + "/tmp/" + fileName + ".json", () => void {});
        }, deleteTime * 1000);
    }
}

app.get("/", (req, res) => {
    //res.sendFile(__dirname + "/public/index.html");
    res.send("<p>heuua</p>");
});

app.use(express.static("./public"));
app.listen(port);