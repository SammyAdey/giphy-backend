const express = require("express");
const {
	SQSClient,
	SendMessageCommand,
	ReceiveMessageCommand,
	DeleteMessageCommand,
	DeleteMessageBatchCommand,
	GetQueueUrlCommand,
} = require("@aws-sdk/client-sqs");
const sqsClient = new SQSClient({ region: "ap-southeast-2" });
const { configDetails } = require("../config.js");

const getQueueUrl = async () => {
	const command = new GetQueueUrlCommand({ QueueName: configDetails.sqsQueueName });
	const response = await sqsClient.send(command);
	// console.log(response);
	return response;
};

const sendMessageToQueue = async (body, imageId, queueUrl) => {
	try {
		const command = new SendMessageCommand({
			MessageBody: body,
			QueueUrl: queueUrl,
			MessageAttributes: {
				ImageId: { DataType: "String", StringValue: imageId },
			},
		});
		const result = await sqsClient.send(command);
		console.log(result);
		console.log("Image Added to Queue Successfully \n");
	} catch (error) {
		console.log(error);
	}
};

const receiveMessage = (queueUrl) =>
	sqsClient.send(
		new ReceiveMessageCommand({
			MaxNumberOfMessages: 1,
			MessageAttributeNames: ["All"],
			QueueUrl: queueUrl,
		})
	);

const deleteMessage = (Message, queueUrl) =>
	sqsClient.send(
		new DeleteMessageCommand({
			QueueUrl: queueUrl,
			ReceiptHandle: Message.ReceiptHandle,
		})
	);

// Export all Modules
module.exports = {
	getQueueUrl,
	sendMessageToQueue,
	receiveMessage,
	deleteMessage,
};
