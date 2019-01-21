/*jshint esversion: 6 */
require('v8-compile-cache');
const multer = require("multer");
const express = require("express");
const app = express();
const path = require("path");
const port = 3000;
const upload = multer({
    dest: "/tmp/"
});
const fs = require("fs");

app.get("/", function (req, res) {
    res.sendFile(path.join(__dirname + "/public/index.html"));
});

/*app.post("/file_upload", upload.single("file"), function (req, res) {
    var file = __dirname + "/" + req.file.filename;
    fs.rename(req.file.path, file, function (err) {
        if (err) {
            res.sendStatus(500);
            console.log(err);
        } else {
            res.json({
                message: "File uploaded",
                filename: req.filename
            });
            console.log(res.json);
        }
    });
});*/

app.post('/file_upload', upload.single("file"), function (req, res) {
    var file = __dirname + "/" + req.file.originalname;
    fs.readFile(req.file.path, function (err, data) {
        fs.writeFile(file, data, function (err) {
            if (err) {
                console.error(err);
                response = {
                    message: 'Sorry, file couldn\'t be uploaded.',
                    filename: req.file.originalname
                };
            } else {
                response = {
                    message: 'File uploaded successfully',
                    filename: req.file.originalname
                };
            }
            res.end(JSON.stringify(response));
        });
    });
})


app.use(express.static("./public"));
app.listen(port);