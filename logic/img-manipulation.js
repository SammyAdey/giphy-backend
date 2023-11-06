const sharp = require("sharp");
const imagemagick = require("imagemagick");
const fs = require("fs");
const path = require("path");

const FRAMES = 10; // Change this to increase/decrease CPU usage.
const MORPH_FRAMES = 10; // Number of transition frames between hues

// Generates a hue-shifted frame for a given hue value.
const generateHueShiftedFrame = async (inputPath, hueShift, outputPath) => {
	return new Promise((resolve, reject) => {
		imagemagick.convert([inputPath, "-modulate", `100,100,${hueShift}`, outputPath], (err) => {
			if (err) reject(err);
			else resolve(outputPath);
		});
	});
};

// Generates a series of frames with a rainbow effect.
const generateRainbowFrames = async (inputPath, tempDir) => {
	let framePaths = [];
	const hueStep = 360 / FRAMES;

	let previousFrame = inputPath;
	for (let i = 0; i <= 360; i += hueStep) {
		let currentFrame = i === 360 ? inputPath : path.join(tempDir, `hue_${i}.png`);
		if (i !== 360) {
			await generateHueShiftedFrame(inputPath, i, currentFrame);
		}

		let morphedFrameBase = path.join(tempDir, `morph_${i}_to_${(i + hueStep) % 360}_%d.png`);
		await new Promise((resolve, reject) => {
			imagemagick.convert([previousFrame, currentFrame, "-morph", String(MORPH_FRAMES), morphedFrameBase], (err) => {
				if (err) reject(err);
				else resolve();
			});
		});

		for (let j = 0; j <= MORPH_FRAMES; j++) {
			framePaths.push(morphedFrameBase.replace("%d", j));
		}

		previousFrame = currentFrame;
	}

	return framePaths;
};

// Combines the individual frames to create a GIF.
const combineFramesToGif = async (framePaths, gifPath) => {
	return new Promise((resolve, reject) => {
		imagemagick.convert([...framePaths, "-delay", "10", "-loop", "0", gifPath], (err) => {
			if (err) reject(err);
			else resolve();
		});
	});
};

// Removes the temporary files and directories used during GIF creation.
const cleanupTemporaryFiles = (tempDir) => {
	fs.rmSync(tempDir, { recursive: true, force: true });
};

// Generates a random ID for uniqueness.
const generateRandomId = () => {
	const CHAR_SET = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
	let = id_length = 7;
	let result = "";
	for (let i = 0; i < id_length; i++) {
		result += CHAR_SET.charAt(Math.floor(Math.random() * CHAR_SET.length));
	}
	return result;
};

// Generates a unique GIF name.
const generateUniqueGifName = (originalName) => {
	const nameWithoutExtension = path.parse(originalName).name;
	const uniqueIdentifier = generateRandomId();
	return `${nameWithoutExtension}_prcsd.gif`;
};

// Main image processing function.
const processImage = async (image, maxWidth, maxHeight) => {
	const startTime = new Date();

	let gifFileName = generateUniqueGifName(image);
	let gifPath = `images/outputs/${gifFileName}`;

	let inputPath = `images/inputs/${image}`;
	const tempDir = path.join("images", "outputs", "temp_" + gifFileName.replace(".gif", ""));
	let resizedImagePath = path.join(tempDir, `resized_${image}`);

	if (!fs.existsSync(tempDir)) {
		fs.mkdirSync(tempDir, { recursive: true });
	}

	await sharp(inputPath).resize(maxWidth, maxHeight).toFile(resizedImagePath);
	console.log(`Image resized successfully`);

	let framePaths = await generateRainbowFrames(resizedImagePath, tempDir);
	console.log(`Rainbow frames generated`);

	await combineFramesToGif(framePaths, gifPath);
	console.log(`GIF generated`);

	cleanupTemporaryFiles(tempDir);

	const endTime = new Date();
	const duration = (endTime - startTime) / 1000;
	console.log(`FileName: ${gifFileName} Total processing time: ${duration.toFixed(2)} seconds`);
	return gifFileName;
};

module.exports = { processImage };
