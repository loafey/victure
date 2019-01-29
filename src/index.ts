import v8 = require("v8-compile-cache");
v8;
import multer = require("multer");
import express = require("express");
import rimraf = require("rimraf");
import fs = require("fs");
import path = require("path");
import crypto = require("crypto");
import passport = require("passport");


var app = express();
var tempFolder: string = __dirname + "/tmp";
var port: string = process.env.PORT || String(3000);
var upload: multer = multer({
    dest: tempFolder
});

console.log("Hosting on: " + port);

var emptyTMP: Function = () => {
    fs.access(tempFolder, (err) => {
        if (!err) {
            rimraf(tempFolder, () => {
                fs.mkdir(tempFolder, () => void {});
            });
        }
    });
}
emptyTMP();

app.post("/file_upload", upload.single("image"), (req: any, res: any) => {
    var file: string = tempFolder + "/" + req.file.filename + path.extname(req.file.originalname);

    res.send("/files/" + req.file.filename);

    var hashSha256: crypto.Hash = crypto.createHash("sha256");
    hashSha256.update(req.body.password);
    var passwordHash: String = hashSha256.digest("hex");

    var fileObj: Object = new Object({
        name: req.file.originalname,
        filename: req.file.filename,
        size: req.file.size,
        mimetype: req.file.mimetype,
        passwordHash: passwordHash,
        deleteTime: req.body.deleteTime
    });

    hashSha256.end();

    var fileObjJson: string = JSON.stringify(fileObj);

    fs.writeFile(tempFolder + "/" + req.file.filename + ".json", fileObjJson, () => void {});

    fs.rename(req.file.path, file, (err) => {
        if (err) {
            res.sendStatus(500);
            console.log(err);
        } else {
            temporaryHost(req.file.filename, path.extname(req.file.originalname), req.body.deleteTime);
        }
    });
});

var temporaryHost: Function = (fileName: any, fileExtension: string, deleteTime: any) => {
    var serverEnded: boolean = false;
    app.get("/files/" + fileName, (req, res) => {
        if (serverEnded == false) {
            res.sendFile(__dirname)
            //res.sendFile(tempFolder + "/" + fileName + fileExtension);
            deleteHost(req, res, deleteTime);
        } else {
            res.redirect("/");
        }
    });

    var deleteHost: Function = (req, res, deleteTime) => {
        setTimeout(() => {
            serverEnded = true;
            fs.unlink(tempFolder + "/" + fileName + fileExtension, () => void {});
            fs.unlink(tempFolder + "/" + fileName + ".json", () => void {});
        }, deleteTime * 60000);
    }
}

app.get("/", (req, res) => {
    res.send("<p>heuua</p>");
});

app.use(express.static("./public"));
app.listen(port);


process.on("SIGINT", () => {
    emptyTMP();
});

process.on("SIGTERM", () => {
    emptyTMP();
});