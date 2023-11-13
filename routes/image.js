const express = require("express");
const router = express.Router();
const S3 = require("aws-sdk/clients/s3");
const { configDetails } = require("../config.js");

const s3 = new S3({ apiVersion: "2006-03-01" });

router.get("/:key", (req, res) => {
	const key = req.params.key;
	const readStream = getFileStream(key);

	readStream.pipe(res);
});

//downloads an image from s3
const getFileStream = (fileKey) => {
	const downloadParams = {
		Key: fileKey,
		Bucket: "giphy-color-n11176261",
	};

	return s3.getObject(downloadParams).createReadStream();
};

module.exports = router;
