const express = require('express');
const path = require('path');

const app = express();
const PORT  = process.env.PORT || 80;  // need 8080 ?? 403??

// serve all static files
app.use(express.static(path.join(__dirname, 'client')));

app.get('/*splat', (req, res) => {
	res.sendFile(path.join(__dirname, 'client', 'index.html'));
});

app.listen(PORT, () => {
	console.log(`portfolio server running on:  ${PORT}`);
});






