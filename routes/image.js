const express = require("express");
const router = express.Router();
const S3 = require("aws-sdk/clients/s3");
const { configDetails } = require("../config.js");

const s3 = new S3({ apiVersion: "2006-03-01" });

router.get("/:key", async (req, res) => {
	const key = req.params.key;
	console.log("Trying to fetch file with key: ", key);
	var readStream = null;
	try {
		readStream = await getFileStream(key);
	} catch (error) {
		console.log("Error occurred while fetching file:", error.data);
		res.status(500).send("Error occurred while fetching file");
		return;
	}

	readStream.on("error", (err) => {
		console.log("Error occurred while streaming file:", err);
		res.status(500).send("Error occurred while streaming file");
	});

	readStream.pipe(res);
});

//downloads an image from s3
const getFileStream = async (fileKey) => {
	const downloadParams = {
		Key: fileKey,
		Bucket: configDetails.bucketName,
	};

	return s3.getObject(downloadParams).createReadStream();
};

module.exports = router;
