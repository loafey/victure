import v8 = require("v8-compile-cache");
v8;
import multer = require("multer");
import express = require("express");
import rimraf = require("rimraf");
import fs = require("fs");
import path = require("path");
import moment = require("moment");
//import crypto = require("crypto");


var app = express();
var tempFolder: string = __dirname + "/tmp";
var port: string = process.env.PORT || String(3000);
var upload: multer = multer({
    dest: tempFolder
});

console.log("Hosting on: " + port);

var emptyTMP: Function = (callback: Function) => {
    fs.access(tempFolder, (err) => {
        if (!err) {
            rimraf(tempFolder, () => {
                fs.mkdir(tempFolder, () => void {});
            });
        }
    });
}
emptyTMP();

app.set('view engine', 'pug')
app.post("/file_upload", upload.single("image"), (req: any, res: any) => {
    var file: string = tempFolder + "/" + req.file.filename + path.extname(req.file.originalname);

    res.send("/files/" + req.file.filename);

    //var hashSha256: crypto.Hash = crypto.createHash("sha256");
    //hashSha256.update(req.body.password);
    //var passwordHash: String = hashSha256.digest("hex");

    var fileObj: Object = new Object({
        name: req.file.originalname,
        filename: req.file.filename,
        size: req.file.size,
        mimetype: req.file.mimetype,
        //passwordHash: passwordHash,
        deleteTime: req.body.deleteTime
    });

    //hashSha256.end();

    var fileObjJson: string = JSON.stringify(fileObj);

    fs.writeFile(tempFolder + "/" + req.file.filename + ".json", fileObjJson, () => void {});

    fs.rename(req.file.path, file, (err) => {
        if (err) {
            res.sendStatus(500);
            console.log(err);
        } else {
            temporaryHost(req.file.filename, path.extname(req.file.originalname), req.body.deleteTime, req.file.originalname, req.file.mimetype);
        }
    });
});

var temporaryHost: Function = (fileName: any, fileExtension: string, deleteTime: any, originalTitle: string, mimetype: string) => {
    var serverEnded: boolean = false;
    var deleteAt: string = moment().add(parseFloat(deleteTime), "minutes").format("MMMM Do YYYY, HH:mm:ss");
    var uploadTime: string = moment().format("MMMM Do YYYY, HH:mm:ss")
    app.get("/files/" + fileName, (req, res) => {
        if (serverEnded == false) {
            //res.sendFile(__dirname)
            res.render("files/index", {
                pugImage: "/files/temp/" + fileName,
                pugDeleteTime: deleteAt,
                pugImageTitle: originalTitle,
                pugUploadTime: uploadTime,
                pugFileType: mimetype
            });
            deleteHost(deleteTime);
        } else {
            res.redirect("/");
        }
    });
    app.get("/files/temp/" + fileName, (req, res) => {
        if (serverEnded == false) {
            if (mimetype.indexOf("video") !== -1) {
                res.sendFile(tempFolder + "/" + fileName + fileExtension);
            } else if (mimetype.indexOf("image") !== -1) {
                res.sendFile(tempFolder + "/" + fileName + fileExtension);
            } else {
                res.download(tempFolder + "/" + fileName + fileExtension, originalTitle);
            }
            deleteHost(deleteTime);
        } else {
            res.redirect("/");
        }
    });
    var deleteHost: Function = (deleteTime: number) => {
        setTimeout(() => {
            serverEnded = true;
            fs.unlink(tempFolder + "/" + fileName + fileExtension, () => void {});
            fs.unlink(tempFolder + "/" + fileName + ".json", () => void {});
        }, deleteTime * 60000);//60000 is a min.
    }
}

app.get("/", (req, res) => {
    res.render("index", {})
});

app.get("/faq", (req, res) => {
    res.render("faq/index", {})
});

app.get("/upload", (req, res) => {
    res.render("upload/index", {});
})

app.use(express.static("./public"));
app.listen(port);
