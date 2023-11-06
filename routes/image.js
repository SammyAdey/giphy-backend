const express = require("express");
const router = express.Router();
const S3 = require("aws-sdk/clients/s3");
const { configDetails } = require("../config.js");

const s3 = new S3({ apiVersion: "2006-03-01" });

router.get("/:key", (req, res) => {
	const key = req.params.key;
	try {
		const readStream = getFileStream(key);
		readStream.pipe(res);
		// throw error if file not found
		// readStream.on("error", (err) => {
		// 	throw err;
		// });
	} catch (error) {
		res.status(404).send("File not found");
	}
});

//downloads an image from s3
const getFileStream = (fileKey) => {
	const downloadParams = {
		Key: fileKey,
		Bucket: configDetails.bucketName,
	};

	return s3.getObject(downloadParams).createReadStream();
};

module.exports = router;
