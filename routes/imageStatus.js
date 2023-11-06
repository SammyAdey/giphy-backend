const express = require("express");
const router = express.Router();

let processingStatus = {
	isProcessing: false,
	processedImageKey: null,
};

// Endpoint for checking processing status
router.get("/status", (req, res) => {
	res.json(processingStatus);
});

// Endpoint to mark processing as complete and provide processed image URL
router.post("/complete", (req, res) => {
	const processedImageKey = req.body.processedImageKey;
	processingStatus = {
		isProcessing: false,
		processedImageKey: processedImageKey,
	};
	res.json({ message: "Processing complete" });
});

// Endpoint to reset processing status
router.post("/reset", (req, res) => {
	processingStatus = {
		isProcessing: false,
		processedImageKey: null,
	};
	res.json({ message: "Processing status reset" });
});

module.exports = router;
