const express = require("express");
const { upload, uploadImage } = require("../logic/uploadImage.js");
const router = express.Router();

router.post("/upload", uploadImage, upload);

module.exports = router;
