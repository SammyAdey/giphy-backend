const express = require("express");
const app = express();
const uploadImage = require("./routes/upload");
const getImage = require("./routes/image");
const { processImageFromQueue } = require("./logic/processImage");
const { getQueueUrl } = require("./logic/queue");
const imageStatus = require("./routes/imageStatus");
const { configDetails } = require("./config.js");
const { CreateQueueCommand, SQSClient } = require("@aws-sdk/client-sqs");
var cors = require("cors");
const AWS = require("aws-sdk");
const PORT = 3000;
require("dotenv").config();

// Cloud Services Set-up
// Create unique bucket name
const s3 = new AWS.S3({ apiVersion: "2006-03-01" });
const sqs = new SQSClient({ region: "ap-southeast-2" });

(async () => {
	try {
		const command = new CreateQueueCommand({
			QueueName: configDetails.sqsQueueName,
			Attributes: {
				DelaySeconds: "30",
				MessageRetentionPeriod: "86400",
			},
		});
		const response = await sqs.send(command);
		console.log(response);
	} catch (error) {
		if (error.statusCode === 409) {
			console.log(`Queue already exists: ${configDetails.sqsQueueName}`);
		} else {
			console.log(`Error creating queue: ${error}`);
		}
	}
})();

(async () => {
	try {
		await s3.createBucket({ Bucket: configDetails.bucketName }).promise();
		console.log(`Created bucket: ${bucketName}`);
	} catch (err) {
		// We will ignore 409 errors which indicate that the bucket already exists;
		if (err.statusCode === 409) {
			console.log(`Bucket already exists: ${configDetails.bucketName}`);
		} else {
			console.log(`Error creating bucket: ${err}`);
		}
	}
})();

// Middleware to parse JSON data from the request body
app.use(express.json());
// Middleware to enable CORS
app.use(cors());
app.use("/", uploadImage);
app.use("/images", getImage);
app.use("/image", imageStatus);
// app.use("/queue", queue);
app.listen(PORT, () => {
	console.log(`Server running at http://localhost:${PORT}/`);
});
