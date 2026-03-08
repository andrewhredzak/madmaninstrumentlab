const express = require('express');
const path = require('path');

const app = express();
const PORT  = process.env.PORT || 5000;
const clientDir = path.join(__dirname, 'client');

// Serve the site at the root URL, and keep /client as a compatibility alias.
app.use(express.static(clientDir));
app.use('/client', express.static(clientDir));

app.get('/*splat', (req, res) => {
	res.sendFile(path.join(clientDir, 'index.html'));
});

app.listen(PORT, () => {
	console.log(`portfolio server running on:  ${PORT}`);
});






