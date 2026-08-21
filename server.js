const express = require('express');
const path = require('path');

const app = express();

// Hostinger assigns a dynamic port via process.env.PORT
const PORT = process.env.PORT || 3000;

// Serve all static assets from the "public" folder
app.use(express.static(path.join(__dirname, 'public')));

// Fallback to index.html for the root route
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, () => {
    console.log(`Server is running successfully on port ${PORT}`);
});
