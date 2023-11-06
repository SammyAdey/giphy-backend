const multer = require("multer");
const { sendMessageToQueue, getQueueUrl } = require("./queue");
const { processImageFromQueue } = require("../logic/processImage");
const fs = require("fs");
const util = require("util");
const unLinkFile = util.promisify(fs.unlink);
const { configDetails } = require("../config.js");
const S3 = require("aws-sdk/clients/s3");

const s3 = new S3({ apiVersion: "2006-03-01" });

const multerConfig = multer.diskStorage({
	destination: (req, file, callback) => {
		callback(null, "images/inputs");
	},
	filename: (req, file, callback) => {
		const ext = file.mimetype.split("/")[1];
		callback(null, `image-${Date.now()}.${ext}`);
	},
});

const uploadS3 = (file) => {
	const path = `images/inputs/${file}`;
	const fileStream = fs.createReadStream(path);

	const uploadParams = {
		Bucket: configDetails.bucketName,
		Body: fileStream,
		Key: file,
	};

	return s3.upload(uploadParams).promise();
};

const upload = multer({
	storage: multerConfig,
});

exports.uploadImage = upload.single("photo");

exports.upload = async (req, res) => {
	// Console log the file uploaded by Multer
	console.log(req.file);
	console.log(req.file.filename);
	console.log(req.file.originalname);

	// Upload the file to S3
	const fileName = req.file.filename;
	const result = await uploadS3(fileName);
	console.log("\n Original File uploaded successfully.\n");
	console.log(result);

	// Send the file name to the SQS queue
	const { QueueUrl } = await getQueueUrl();
	const body = req.file.originalname;
	await sendMessageToQueue(body, fileName, QueueUrl);

	// Delete the file from the local directory
	await unLinkFile(req.file.path);

	// Send the response
	res.status(200).json({
		success: "image uploaded successfully.",
		imagePath: `/images/${fileName}`,
	});
};
