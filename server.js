const express = require('express');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 3000;
const MESSAGES_FILE = path.join(__dirname, 'messages.json');

app.use(express.json());
app.use(express.static(__dirname));

// Ensure messages file exists
if (!fs.existsSync(MESSAGES_FILE)) {
    fs.writeFileSync(MESSAGES_FILE, JSON.stringify([]));
}

// GET all messages (for new visitors and on page refresh)
app.get('/api/messages', (req, res) => {
    try {
        const data = fs.readFileSync(MESSAGES_FILE, 'utf8');
        res.json(JSON.parse(data || '[]'));
    } catch (err) {
        res.json([]);
    }
});

// POST a new message
app.post('/api/messages', (req, res) => {
    const { name, city, text } = req.body;
    if (!name || !city || !text) {
        return res.status(400).json({ error: 'Name, City, and Message are required.' });
    }

    try {
        const data = fs.readFileSync(MESSAGES_FILE, 'utf8');
        const messages = JSON.parse(data || '[]');
        
        const newMsg = {
            id: Date.now(),
            name: name.slice(0, 40),
            city: city.slice(0, 40),
            text: text.slice(0, 300),
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };

        // Keep last 150 messages to ensure high speed
        messages.push(newMsg);
        if (messages.length > 150) messages.shift();

        fs.writeFileSync(MESSAGES_FILE, JSON.stringify(messages, null, 2));
        res.json({ success: true, message: newMsg });
    } catch (err) {
        res.status(500).json({ error: 'Failed to save message' });
    }
});

// Fallback to index.html
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(PORT, () => {
    console.log(`Server active on port ${PORT}`);
});
