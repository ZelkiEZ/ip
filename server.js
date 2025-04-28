const express = require('express');
const fs = require('fs');
const app = express();
const PORT = 3000;

// Middleware to parse JSON and serve static files
app.use(express.json());
app.use(express.static('public'));

// Route to log captured data
app.post('/log', (req, res) => {
    const clientIP = req.ip || req.headers['x-forwarded-for'] || req.connection.remoteAddress;
    const logData = {
        timestamp: new Date().toISOString(),
        ip: clientIP,
        ...req.body
    };

    // Save logs to a file (for testing)
    fs.appendFile('logs.txt', JSON.stringify(logData) + '\n', (err) => {
        if (err) console.error("Error writing log:", err);
    });

    console.log("Logged:", logData);
    res.sendStatus(200);
});

// Start server
app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});