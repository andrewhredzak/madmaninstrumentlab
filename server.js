const express = require('express');
const path = require('path');

const app = express();
const PORT  = process.env.PORT || 3600;
const clientDir = path.join(__dirname, 'client');

// Serve the landing page from index.html and keep /client as a compatibility alias.
const staticOptions = { index: 'index.html' };

app.use(express.static(clientDir, staticOptions));
app.use('/client', express.static(clientDir, staticOptions));

app.get('/*splat', (req, res) => {
	res.sendFile(path.join(clientDir, 'index.html'));
});

app.listen(PORT, () => {
	console.log(`madman industries server running on: ${PORT}`);
});
