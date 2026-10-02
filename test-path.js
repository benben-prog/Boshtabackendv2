const express = require('express');
const app = express();
app.use('/api/student', (req, res, next) => {
    console.log(req.path);
    process.exit(0);
});
const request = require('http').request;
app.listen(8998, () => {
    request('http://localhost:8998/api/student/live-sessions/8/download-material', (res) => {}).end();
});
