const express = require('express');
const app = express();
const apiMiddelware = require('./src/middlewares/apiAuth.middleware');
app.use('/api/student', apiMiddelware, (req, res) => {
    res.json({ success: true, path: req.path });
});
app.listen(8999, () => console.log('Listening on 8999'));
