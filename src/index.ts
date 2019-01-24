import v8 = require("v8-compile-cache");
v8;
import multer = require("multer");
import express = require("express");
import rimraf = require("rimraf");


var app = express();
var port = process.env.PORT || 3000;