# Features

- Resizes the specified image to a default or provided dimension.
- Generates a GIF with a rainbow effect by cycling the image through various hues.
- Outputs the resulting GIF in the `images/outputs` directory.

## Setup & Installation

### Prerequisites

1. ImageMagick needs to be installed as it's a crucial dependency for image manipulation.

   For MacOS:
   ```
   brew install imagemagick
   ```

   For Ubuntu:
   ```
   sudo apt-get install imagemagick
   ```

2. Node.js packages:

   ```
   npm install sharp imagemagick
   ```

## Running the Project

1. Navigate to the project directory in your terminal.
2. Start the server with one of the following commands:

   ```
   node index.js
   ```

   OR if you have `nodemon` installed:

   ```
   nodemon index.js
   ```

3. Once the server is running, open a web browser and visit `http://localhost:3000`.
4. The processed GIF will be saved in the `images/outputs` directory.

**Note:** Before running, ensure the `IMAGE` constant in `index.js` points to the desired image for processing. Modify this constant to change the input image.