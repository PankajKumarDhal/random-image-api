const express = require('express');
const path = require('path');
const fs = require('fs');
const yaml = require('js-yaml');
const fsPromises = fs.promises;

// Load configuration from YAML
const configPath = path.join(__dirname, 'config', 'config.yaml');
const config = yaml.load(fs.readFileSync(configPath, 'utf8'));

const app = express();
const PORT = config.server.port;
const IMAGE_FOLDER = path.resolve(__dirname, config.images.folder);

// Route to fetch a random image
app.get('/api/image/random', async (req, res) => {
    try {
        const files = await fsPromises.readdir(IMAGE_FOLDER);
        if (!files.length) {
            return res.status(404).json({ error: 'No images found in the folder' });
        }

        // Select a random image
        const randomImage = files[Math.floor(Math.random() * files.length)];
        const imagePath = path.join(IMAGE_FOLDER, randomImage);

        // Send the image as the response
        res.sendFile(imagePath);
    } catch (error) {
        console.error('Error fetching random image:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Root route
app.get('/', (req, res) => {
    res.send('Welcome to the Random Image API!');
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
