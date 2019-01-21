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
    var file = __dirname + "/" + req.file.filename;
    fs.rename(req.file.path, "./tmp/" + req.body[1].originalname, function (err) {
        if (err) {
            res.sendStatus(500);
            console.log(err);
        } else {
            res.json({
                message: "File uploaded",
                filename: req.filename
            });
        }
    });
});

app.use(express.static("./public"));
app.listen(port);